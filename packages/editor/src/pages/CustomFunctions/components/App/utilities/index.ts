import type { IFunction, ICustomFunctionsMetadata } from "common/build/custom-functions/parseTree";

import compileScript from "common/build/utilities/compile.script";
import { stripSpaces } from "common/build/utilities/string";
import { consoleMonkeypatch } from "./console.monkeypatch";
import { pause } from "common/build/utilities/misc";
import { findScript } from "common/build/utilities/solution";
import {
  parseMetadata,
  transformSolutionNameToCFNamespace,
  getAllowCustomDataForDataTypeAny,
} from "../../../../../utils/custom-functions";

export function getJsonMetadataString(
  functions: Array<ICustomFunctionParseResult<IFunction>>,
  options?: object,
): string {
  const registrationPayload: ICustomFunctionsMetadata = {
    functions: functions.filter((func) => func.status === "good").map((func) => func.metadata),
  };

  if (options instanceof Object && options["allowCustomDataForDataTypeAny"] !== undefined) {
    registrationPayload["allowCustomDataForDataTypeAny"] = options["allowCustomDataForDataTypeAny"];
  }

  return JSON.stringify(registrationPayload, null, 4);
}

export async function registerCustomFunctions(
  functions: Array<ICustomFunctionParseResult<IFunction>>,
  code: string,
  options: object,
): Promise<void> {
  const jsonMetadataString = getJsonMetadataString(functions, options);

  if (Office.context.requirements.isSetSupported("CustomFunctions", 1.6)) {
    await (Excel as any).CustomFunctionManager.register(jsonMetadataString, code);
  } else {
    await Excel.run(async (context) => {
      if (Office.context.platform === Office.PlatformType.OfficeOnline) {
        const namespace = getScriptLabTopLevelNamespace().toUpperCase();
        (context.workbook as any).registerCustomFunctions(
          namespace,
          jsonMetadataString,
          "" /*addinId*/,
          "en-us",
          namespace,
        );
      } else {
        (Excel as any).CustomFunctionManager.newObject(context).register(jsonMetadataString, code);
      }
      await context.sync();
    });
  }
}

export async function getCustomFunctionEngineStatusSafe(): Promise<ICustomFunctionEngineStatus> {
  try {
    if (!Office.context.requirements.isSetSupported("CustomFunctions", 1.4)) {
      return { enabled: false };
    }

    const platform = Office.context.platform;

    const isOnSupportedPlatform =
      platform === Office.PlatformType.PC ||
      platform === Office.PlatformType.Mac ||
      platform === Office.PlatformType.OfficeOnline;
    if (isOnSupportedPlatform) {
      return getEngineStatus();
    }

    return { enabled: false };
  } catch (e) {
    console.error('Could not perform a "getCustomFunctionEngineStatus" check');
    console.error(e);
    return { enabled: false };
  }

  // Helpers:

  async function getEngineStatus(): Promise<ICustomFunctionEngineStatus> {
    if (Office.context.requirements.isSetSupported("CustomFunctions", 1.6)) {
      const status = await (Excel as any).CustomFunctionManager.getStatus();
      return {
        enabled: status.enabled,
        nativeRuntime: status.nativeRuntime,
      };
    } else {
      return tryExcelRun(async (context): Promise<ICustomFunctionEngineStatus> => {
        const manager = (Excel as any).CustomFunctionManager.newObject(context).load("status");
        await context.sync();

        return {
          enabled: manager.status.enabled,
          nativeRuntime: manager.status.nativeRuntime,
        };
      });
    }
  }

  async function tryExcelRun(
    callback: (context: Excel.RequestContext) => Promise<ICustomFunctionEngineStatus>,
  ) {
    while (true) {
      try {
        return Excel.run(async (context) => await callback(context));
      } catch (e) {
        const isInCellEditMode =
          e instanceof OfficeExtension.Error &&
          e.code === Excel.ErrorCodes.invalidOperationInCellEditMode;
        if (isInCellEditMode) {
          await pause(2000);
          continue;
        } else {
          return { enabled: false };
        }
      }
    }
  }
}

export function getScriptLabTopLevelNamespace() {
  return "ScriptLab";
}

export function getCustomFunctionsInfoForRegistration(solutions: ISolution[]): {
  parseResults: Array<ICustomFunctionParseResult<IFunction>>;
  code: string;
  options: object;
} {
  const parseResults: Array<ICustomFunctionParseResult<IFunction>> = [];
  const code: string[] = [decodeURIComponent(consoleMonkeypatch.trim())];

  solutions.forEach((solution) => {
    if (solution.name.length === 0) {
      return;
    }

    const scriptFile = findScript(solution);
    if (!scriptFile) {
      return;
    }

    const namespace = transformSolutionNameToCFNamespace(solution.name);
    const fileContent = findScript(solution)!.content;

    const functions: Array<ICustomFunctionParseResult<IFunction>> = parseMetadata({
      solution,
      namespace,
      fileContent,
    });

    let hasErrors = functions.some((func) => func.status === "error");

    let snippetCode: string;
    if (!hasErrors) {
      try {
        snippetCode = compileScript(fileContent);
        code.push(
          wrapCustomFunctionSnippetCode(
            snippetCode,
            functions.map((func) => ({
              fullId: func.metadata.id,
              fullDisplayName: func.metadata.name,
              javascriptFunctionName: func.javascriptFunctionName,
            })),
          ),
        );
      } catch (e) {
        functions.forEach((f) => {
          f.status = "error";
          f.errors = f.errors || [];
          f.errors.unshift("Snippet compiler error");
        });
        hasErrors = true;
      }
    }

    functions.forEach((func) => parseResults.push(func));
  });

  const options = {
    allowCustomDataForDataTypeAny: getAllowCustomDataForDataTypeAny(),
  };

  return { parseResults: parseResults, code: code.join("\n\n"), options: options };
}

// helpers

function wrapCustomFunctionSnippetCode(
  code: string,
  functions: Array<{
    fullId: string;
    fullDisplayName: string;
    javascriptFunctionName: string;
  }>,
): string {
  const newlineAndIndents = "\n        ";

  const almostReady = stripSpaces(`
    (function () {
      try {
        // TODO external code
        ${code
          .split("\n")
          .map((line) => newlineAndIndents + line)
          .join("")}
        ${generateFunctionAssignments(true /*success*/)}
      } catch (e) {
        ${generateFunctionAssignments(false /*success*/)}
      }
    })();
  `);

  return almostReady
    .split("\n")
    .map((line) => line.trimRight())
    .join("\n");

  // Helper
  function generateFunctionAssignments(success: boolean) {
    return functions
      .map((item) => {
        return `CustomFunctions.associate("${item.fullId}", ${getRightSide()});`;

        function getRightSide() {
          return success
            ? `__generateFunctionBinding__("${item.fullDisplayName}", ${item.javascriptFunctionName})`
            : `__generateErrorFunction__("${item.fullDisplayName}", e)`;
        }
      })
      .join(newlineAndIndents);
  }
}

export const filterCustomFunctions = (solutions: ISolution[]): ISolution[] =>
  solutions.filter((solution) => solution.options.isCustomFunctionsSolution);
