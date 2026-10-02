// CommonJS compiled version of datasetReader for direct node execution / testing
const fs = require('fs');

function parseCSV(content) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField);
        currentField = '';
      } else if (char === '\r') {
        if (nextChar === '\n') i++;
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else if (char === '\n') {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  if (rows.length === 0) return [];

  const headers = rows[0].map((h) => h.trim());
  const parsedRecords = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (row.length === 1 && row[0].trim() === '') continue;
    const record = {};
    for (let c = 0; c < headers.length; c++) {
      record[headers[c]] = c < row.length ? row[c] : '';
    }
    parsedRecords.push(record);
  }

  return parsedRecords;
}

function parseBool(val) {
  if (!val) return false;
  const s = val.trim().toLowerCase();
  return s === 'true' || s === '1' || s === 't' || s === 'yes';
}

function parseGeoJSON(val) {
  if (!val || !val.trim()) return null;
  try {
    return JSON.parse(val.trim());
  } catch (err) {
    return val;
  }
}

function readLamsFullDataset(csvPath, hashPasswordFn) {
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parseCSV(fileContent);

  const dataset = {
    villages: [],
    owners: [],
    projects: [],
    parcels: [],
    litigation_cases: [],
    parcel_project_overlaps: [],
    project_stage_history: [],
    candidate_alignments: [],
    rr_families: [],
    grievances: [],
    documents: [],
    users: [],
  };

  const defaultBcryptHash = '$2a$10$D4Q5VMvWQ6GTNeqC4qHJ1uhRlteb6ttfGDNTnX8rd9Q1MxOvyHv7q';

  for (const row of records) {
    const entityType = row.entity_type ? row.entity_type.trim() : '';

    switch (entityType) {
      case 'village':
        dataset.villages.push({
          village_id: row.village_id || row.record_id,
          record_id: row.record_id,
          name: row.name,
          tehsil: row.tehsil,
          district: row.district,
          state: row.state,
          lat: parseFloat(row.lat) || 0,
          lon: parseFloat(row.lon) || 0,
        });
        break;

      case 'owner':
        dataset.owners.push({
          owner_id: row.owner_id || row.record_id,
          record_id: row.record_id,
          name: row.name,
          gender: row.gender,
          masked_phone: row.masked_phone,
          village_id: row.village_id,
        });
        break;

      case 'project':
        dataset.projects.push({
          project_id: row.project_id || row.record_id,
          record_id: row.record_id,
          name: row.name,
          type: row.type,
          districts: row.districts,
          current_stage: row.current_stage,
          start_date: row.start_date,
          is_delayed: parseBool(row.is_delayed),
          current_stage_sla_deadline: row.current_stage_sla_deadline,
          total_parcels: parseInt(row.total_parcels, 10) || 0,
        });
        break;

      case 'parcel':
        dataset.parcels.push({
          parcel_id: row.parcel_id || row.record_id,
          record_id: row.record_id,
          ulpin: row.ulpin,
          survey_number: row.survey_number,
          village_id: row.village_id,
          village_name: row.village_name,
          district: row.district,
          tehsil: row.tehsil,
          owner_id: row.owner_id,
          area_ha: parseFloat(row.area_ha) || 0,
          land_use: row.land_use,
          status: row.status,
          project_id: row.project_id,
          project_name: row.project_name,
          centroid_lat: parseFloat(row.centroid_lat) || 0,
          centroid_lon: parseFloat(row.centroid_lon) || 0,
          geometry_geojson: parseGeoJSON(row.geometry_geojson),
        });
        break;

      case 'litigation_case':
        dataset.litigation_cases.push({
          case_number: row.case_number || row.record_id,
          record_id: row.record_id,
          parcel_id: row.parcel_id,
          case_type: row.case_type,
          court: row.court,
          filed_date: row.filed_date,
          status: row.status,
        });
        break;

      case 'parcel_project_overlap':
        dataset.parcel_project_overlaps.push({
          record_id: row.record_id,
          parcel_id: row.parcel_id,
          primary_project_id: row.primary_project_id,
          overlapping_project_id: row.overlapping_project_id,
          note: row.note,
        });
        break;

      case 'project_stage_history':
        dataset.project_stage_history.push({
          record_id: row.record_id,
          project_id: row.project_id,
          stage: row.stage,
          start_date: row.start_date,
          end_date: row.end_date ? row.end_date.trim() : null,
          status: row.status,
          sla_days: parseInt(row.sla_days, 10) || 0,
        });
        break;

      case 'candidate_alignment':
        dataset.candidate_alignments.push({
          alignment_id: row.alignment_id || row.record_id,
          record_id: row.record_id,
          project_id: row.project_id,
          label: row.label,
          geometry_geojson: parseGeoJSON(row.geometry_geojson),
        });
        break;

      case 'rr_family':
        dataset.rr_families.push({
          family_id: row.family_id || row.record_id,
          record_id: row.record_id,
          parcel_id: row.parcel_id,
          owner_id: row.owner_id,
          project_id: row.project_id,
          members_count: parseInt(row.members_count, 10) || 0,
          vulnerable_sc_st: parseBool(row.vulnerable_sc_st),
          vulnerable_women_headed: parseBool(row.vulnerable_women_headed),
          entitlement_house: parseBool(row.entitlement_house),
          entitlement_employment: parseBool(row.entitlement_employment),
          subsistence_allowance_inr: parseInt(row.subsistence_allowance_inr, 10) || 0,
          rr_status: row.rr_status,
        });
        break;

      case 'grievance':
        dataset.grievances.push({
          grievance_id: row.grievance_id || row.record_id,
          record_id: row.record_id,
          parcel_id: row.parcel_id,
          owner_id: row.owner_id,
          project_id: row.project_id,
          type: row.type,
          filed_date: row.filed_date,
          status: row.status,
        });
        break;

      case 'document':
        dataset.documents.push({
          document_id: row.document_id || row.record_id,
          record_id: row.record_id,
          parcel_id: row.parcel_id,
          project_id: row.project_id,
          doc_type: row.doc_type,
          filename: row.filename,
          version: parseInt(row.version, 10) || 1,
          sha256_hash: row.sha256_hash,
          uploaded_by_role: row.uploaded_by_role,
          uploaded_date: row.uploaded_date,
        });
        break;

      case 'user': {
        const rawPassword = row.password || 'Demo@123';
        const hashedPassword = hashPasswordFn
          ? hashPasswordFn(rawPassword)
          : defaultBcryptHash;

        dataset.users.push({
          record_id: row.record_id || row.email,
          email: row.email,
          role: row.role,
          password: hashedPassword,
          linked_id: row.linked_id ? row.linked_id.trim() : null,
        });
        break;
      }

      default:
        break;
    }
  }

  return dataset;
}

module.exports = { readLamsFullDataset };
