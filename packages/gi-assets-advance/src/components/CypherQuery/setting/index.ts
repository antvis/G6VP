// @ts-nocheck
import functions from "./functions.json";
import procedures from "./procedures.json";

export const defaultCodeMirrorSettings = {
  value: `MATCH (n:Domain) 
  WHERE n.id in ['Domain_c58c149eec59bb14b0c102a0f303d4c20366926b5c3206555d2937474124beb9','Domain_f3554b666038baffa5814c319d3053ee2c2eb30d31d0ef509a1a463386b69845'] 
  RETURN n`,
  mode: "application/x-cypher-query",
  indentWithTabs: true,
  smartIndent: false,
  lineNumbers: true,
  matchBrackets: true,
  autofocus: true,
  theme: "cypher cypher-dark",
  lint: true,
  styleActiveLine: true,
  extraKeys: { "Ctrl-Space": "autocomplete" },
  hintOptions: {
    completeSingle: false,
    closeOnUnfocus: false,
    alignWithWord: true,
    async: true
  },
  gutters: ["cypher-hints"],
  lineWrapping: true,
  autoCloseBrackets: {
    explode: ""
  }
};

export const defaultCypherSchema = {
  consoleCommands: [
    { name: ":clear" },
    { name: ":play" },
    { name: ":help", description: "this is help command" },
    {
      name: ":server",
      commands: [
        {
          name: "user",
          commands: [{ name: "list", description: "listdesc" }, { name: "add" }]
        }
      ]
    },
    { name: ":schema" },
    { name: ":history" },
    { name: ":queries" }
  ],
  labels: [
    ":Spacey mc spaceface",
    ":Legislator",
    ":State",
    ":Party",
    ":Body",
    ":Bill",
    ":Subject",
    ":Committee",
    ":Congress"
  ],
  relationshipTypes: [
    ":REPRESENTS",
    ":IS_MEMBER_OF",
    ":ELECTED_TO",
    ":PROPOSED_DURING",
    ":SPONSORED_BY",
    ":VOTED ON",
    ":REFERRED_TO",
    ":SERVES_ON",
    ":DEALS_WITH"
  ],
  parameters: ["age", "name", "surname"],
  propertyKeys: [
    "bioguideID",
    "code",
    "name",
    "type",
    "billID",
    "title",
    "thomasID",
    "birthday",
    "wikipediaID",
    "currentParty",
    "state",
    "votesmartID",
    "fecIDs",
    "republicanCount",
    "otherCount",
    "cspanID",
    "democratCount",
    "lastName",
    "firstName",
    "party",
    "opensecretsID",
    "icpsrID",
    "religion",
    "lisID",
    "govtrackID",
    "gender",
    "district",
    "number",
    "enacted",
    "officialTitle",
    "vetoed",
    "active",
    "popularTitle",
    "cosponsor",
    "vote",
    "jurisdiction",
    "url",
    "rank",
    "washpostID"
  ],
  functions: functions.data.map(data => ({
    name: data.row[0],
    signature: data.row[1].replace(data.row[0], "")
  })),
  procedures: procedures.data.map(data => {
    const name = data.row[0];
    const signature = data.row[1].replace(data.row[0], "");

    let returnItems = [];
    const matches = signature.match(/\([^)]*\) :: \((.*)\)/i);

    if (matches) {
      returnItems = matches[1].split(", ").map(returnItem => {
        const returnItemMatches = returnItem.match(/(.*) :: (.*)/);
        return {
          name: returnItemMatches[1],
          signature: returnItemMatches[2]
        };
      });
    }

    return {
      name,
      signature,
      returnItems
    };
  })
};
