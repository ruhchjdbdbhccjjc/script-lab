import createGUID from "uuid";
import { LIBRARIES_FILE_NAME, SCRIPT_FILE_NAME, findScript } from "common/build/utilities/solution";
import { getBoilerplateFiles } from "../newSolutionData";
import { languageMapLowercased } from "common/build/languageMap";

export function setUpMomentJsDurationDefaults(momentInstance: {
  relativeTimeThreshold(threshold: string, limit: number): boolean;
}) {
  momentInstance.relativeTimeThreshold("s", 40);
  // Note, per documentation, "ss" must be set after "s"
  momentInstance.relativeTimeThreshold("ss", 1);
  momentInstance.relativeTimeThreshold("m", 40);
  momentInstance.relativeTimeThreshold("h", 20);
  momentInstance.relativeTimeThreshold("d", 25);
  momentInstance.relativeTimeThreshold("M", 10);
}

const createFile = (name, { content, language }): IFile => ({
  id: createGUID(),
  name,
  content,
  language,
  dateCreated: Date.now(),
  dateLastModified: Date.now(),
  dateLastOpened: Date.now(),
});

export const convertSnippetToSolution = (snippet: ISnippet): ISolution => {
  const { name, description, script, template, style, libraries, host } = snippet;

  const defaultFiles = getBoilerplateFiles(Date.now());

  const files = Object.entries({
    [SCRIPT_FILE_NAME]: script,
    "index.html": template,
    "index.css": style,
    [LIBRARIES_FILE_NAME]: { content: libraries, language: "libraries" },
  }).map(([fileName, file]) =>
    file ? createFile(fileName, file) : defaultFiles.find((file) => file.name === fileName)!,
  ) as IFile[];

  const solution = {
    id: createGUID(),
    name,
    host,
    description,
    options: {},
    files,
    dateCreated: Date.now(),
    dateLastModified: Date.now(),
    dateLastOpened: Date.now(),
  };

  return solution;
};

export const convertSolutionToSnippet = (solution: ISolution): ISnippet => {
  const { name, description, host, files } = solution;

  const mainScriptFile = findScript(solution);

  const snippetFiles =
    mainScriptFile.language === languageMapLowercased.python
      ? {
          script: {
            content: mainScriptFile.content,
            language: mainScriptFile.language,
          },
        }
      : Object.entries({
          script: (file) => file.name === SCRIPT_FILE_NAME,
          template: (file) => file.name === "index.html",
          style: (file) => file.name === "index.css",
          libraries: (file) => file.name === LIBRARIES_FILE_NAME,
        })
          .map(([fileName, fileSelector]) => [fileName, files.find(fileSelector)])
          .filter(([fileName, file]) => file !== undefined)
          .reduce((obj, [fileName, file]) => {
            const name = fileName as string;
            const f = file as IFile;
            return {
              ...obj,
              [name]:
                f.name === LIBRARIES_FILE_NAME
                  ? f.content || ""
                  : { content: f.content, language: f.language },
            };
          }, {});

  return {
    name,
    description,
    host,
    api_set: {},
    ...snippetFiles,
  };
};
