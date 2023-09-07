import { Client, Collection, GatewayIntentBits, Events } from "discord.js";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");

async function loadCommands() {
  try {
    const commandFiles = await fs.readdir(commandsPath);

    for (const file of commandFiles) {
      if (file.endsWith(".js")) {
        const filePath = path.join(commandsPath, file);
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

loadCommands();

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(
      `No command matching '${interaction.commandName}' was found.`
    );
    return;
  }

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);

    const errorMessage = "There was an error while executing this command!";

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: errorMessage, ephemeral: true });
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
