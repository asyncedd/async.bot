import { Events } from "discord.js";

export default {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    const command = interaction.client.commands.get(interaction.commandName);
    if (interaction.isChatInputCommand()) {
      if (!command) {
        console.error(
          `No command matching '${interaction.commandName}' was found.`
        );
        return;
      }

      try {
        await command.execute(interaction, { client: client });
      } catch (error) {
        console.error(error);

        const errorMessage = "There was an error while executing this command!";

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: errorMessage,
            ephemeral: true,
          });
        } else {
          await interaction.reply({ content: errorMessage, ephemeral: true });
        }
      }
    }
    if (interaction.isUserContextMenuCommand()) {
      try {
        await command.execute(interaction, { client: client });
      } catch (error) {
        console.error(error);

        const errorMessage =
          "There was an error while executing this interaction!";

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: errorMessage,
            ephemeral: true,
          });
        } else {
          await interaction.reply({ content: errorMessage, ephemeral: true });
        }
      }
    }
  },
};
