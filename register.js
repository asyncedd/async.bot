import { REST, Routes } from "discord.js";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config();

const commands = [];
// Grab all the command files from the commands directory you created earlier
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commandsPath = path.join(__dirname, "commands");

try {
  const commandFiles = await fs.readdir(commandsPath);

  for (const file of commandFiles) {
    if (file.endsWith(".js")) {
      const filePath = path.join(commandsPath, file);
      const { default: command } = await import(filePath);

      if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }
} catch (error) {
  console.error("Error loading commands:", error);
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      {
        body: commands,
      }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
