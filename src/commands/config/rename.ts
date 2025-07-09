import { input, select } from "@inquirer/prompts";
import { listConnections, renameConnection } from "../../utils/config.js";
import { logger } from "../../utils/logger.js";

export async function executeRenameCommand(
    oldName?: string,
    newName?: string
): Promise<void> {
    const connections = listConnections();
    const connectionNames = Object.keys(connections);

    if (connectionNames.length === 0) {
        logger.info("No saved connections to rename.");
        return;
    }

    const oldNameToRename =
        oldName && connectionNames.includes(oldName)
            ? oldName
            : await select({
                  message: "Select the connection to rename:",
                  choices: connectionNames.map((name) => ({
                      name: name,
                      value: name,
                  })),
              });

    const newNameToSet =
        newName ||
        (await input({
            message: "Enter the new name for the connection:",
            validate: (value) =>
                !connectionNames.includes(value) ||
                "A connection with this name already exists.",
        }));

    try {
        renameConnection(oldNameToRename, newNameToSet);
        logger.success(
            `Connection '${oldNameToRename}' renamed to '${newNameToSet}' successfully.`
        );
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : String(error);
        logger.fail(`Failed to rename connection: ${errorMessage}`);
    }
}
