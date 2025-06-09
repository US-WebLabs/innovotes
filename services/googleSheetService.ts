
import { Proposal, RawSheetProposal } from '../types';
import { GOOGLE_SHEET_ID, GOOGLE_SHEET_GID, GOOGLE_SHEET_BASE_URL } from '../constants';

const parseRowToProposal = (rowCells: any[] | null): Proposal | null => {
  if (!rowCells || rowCells.length < 5) return null; // Expect at least id, title, description, createdby, createdatiso

  const getCellValue = (cell: any): string => cell?.v?.toString() ?? '';
  
  const rawProposal: RawSheetProposal = {
    id: getCellValue(rowCells[0]),
    title: getCellValue(rowCells[1]),
    description: getCellValue(rowCells[2]),
    createdby: getCellValue(rowCells[3]),
    createdatiso: getCellValue(rowCells[4]),
    votesfor: rowCells[5] ? getCellValue(rowCells[5]) : '0', // Default to '0' if cell is missing
    votesagainst: rowCells[6] ? getCellValue(rowCells[6]) : '0',
    votesabstain: rowCells[7] ? getCellValue(rowCells[7]) : '0',
  };

  if (!rawProposal.id || !rawProposal.title) {
    console.warn("Skipping row due to missing ID or Title:", rawProposal);
    return null; 
  }

  return {
    id: rawProposal.id,
    title: rawProposal.title,
    description: rawProposal.description,
    createdBy: rawProposal.createdby,
    createdAt: rawProposal.createdatiso || new Date().toISOString(),
    votes: {
      for: parseInt(rawProposal.votesfor || '0', 10),
      against: parseInt(rawProposal.votesagainst || '0', 10),
      abstain: parseInt(rawProposal.votesabstain || '0', 10),
    },
    userVote: undefined, 
  };
};


export const fetchProposalsFromSheet = async (): Promise<Proposal[]> => {
  if (!GOOGLE_SHEET_GID || GOOGLE_SHEET_ID.includes('YOUR_GOOGLE_SHEET_ID_HERE') || GOOGLE_SHEET_ID.startsWith('e/YOUR_') ) {
    console.warn("Google Sheet ID or GID not configured. Please update constants.ts.");
    throw new Error("Google Sheet not configured. Please update constants.ts.");
  }

  const sheetUrl = `${GOOGLE_SHEET_BASE_URL}${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:json&gid=${GOOGLE_SHEET_GID}`;

  try {
    const response = await fetch(sheetUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch Google Sheet data: ${response.status} ${response.statusText}. URL: ${sheetUrl}`);
    }
    const rawText = await response.text();
    
    const jsonString = rawText.substring(rawText.indexOf('(') + 1, rawText.lastIndexOf(')'));
    
    const parsedJson = JSON.parse(jsonString);

    if (parsedJson.status === 'error') {
        throw new Error(`Google Sheet API error: ${parsedJson.errors.map((e: any) => e.detailed_message).join(', ')}`);
    }

    if (!parsedJson.table || !parsedJson.table.rows) {
      console.warn("Google Sheet data is empty or in an unexpected format:", parsedJson);
      return [];
    }

    const proposals: Proposal[] = [];
    // Column order assumption: id, title, description, createdby, createdatiso, votesfor, votesagainst, votesabstain
    parsedJson.table.rows.forEach((rowObject: { c: any[] | null }, rowIndex: number) => {
      // Check if first cell of the row looks like a header (e.g. "id")
      // This check might be too simplistic if actual data can contain "id" in the first cell.
      // A more robust check might be needed if headers are included. gviz usually strips them.
      if (rowIndex === 0 && rowObject.c && rowObject.c[0]?.v?.toString().toLowerCase() === 'id') {
          console.log("Skipping potential header row from Google Sheet data based on 'id' in first cell.");
          return;
      }
      const proposal = parseRowToProposal(rowObject.c);
      if (proposal) {
        proposals.push(proposal);
      }
    });

    return proposals;

  } catch (error) {
    console.error("Error fetching or parsing Google Sheet data:", error);
    throw error; 
  }
};
