import { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } from "discord.js";

function HEXToVBColor(hex) {
  return parseInt(hex.replace("#", "0x"), 16);
}

export default {
  data: new ContextMenuCommandBuilder()
    .setName("User information")
    .setType(ApplicationCommandType.User),
  async execute(interaction) {
    let user = interaction.targetUser;
    let responseEmbed = EmbedBuilder({
      color: HEXToVBColor("#4ade80"),
      title: `Information for ${user.username}!`,
      fields: [
        {
          name: "Username",
          value: user.username,
        },
        {
          name: "ID",
          value: user.id,
          inline: true,
        },
      ],
    });

    interaction.reply({ embeds: [responseEmbed] });
  },
};
