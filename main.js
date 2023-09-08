import { Client, Collection, GatewayIntentBits } from "discord.js";
import fs from "node:fs";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandFolders = fs.readdirSync("./commands");

async function loadCommands() {
  for (const folder of commandFolders) {
    try {
      const commandFiles = fs
        .readdirSync(`./commands/${folder}`)
        .filter((file) => file.endsWith(".js"));

      for (const file of commandFiles) {
        if (file.endsWith(".js")) {
          const filePath = path.join(
            path.join(__dirname, `commands/${folder}`),
            file
          );
          const { default: command } = await import(filePath);

          if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
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
  }
}

loadCommands();

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  let event = await import(filePath);
  event = event.default;
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(process.env.DISCORD_TOKEN);
