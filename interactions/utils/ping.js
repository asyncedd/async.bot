import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

function HEXToVBColor(hex) {
  return parseInt(hex.replace("#", "0x"), 16);
}

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    let responseEmbed = EmbedBuilder({
      color: HEXToVBColor("#FFFFFF"),
      title: "Pong!",
      fields: [
        {
          name: "Ping",
          value: "Pinging...",
        },
      ],
    });

    const sent = await interaction.reply({
      embeds: [responseEmbed],
      fetchReply: true,
    });

    responseEmbed.color = HEXToVBColor("#4ade80");
    responseEmbed.fields = [
      {
        name: "Ping",
        value: `${sent.createdTimestamp - interaction.createdTimestamp}ms`,
      },
    ];

    sent.edit({ embeds: [responseEmbed] });
  },
};
