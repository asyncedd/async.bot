import { SlashCommandBuilder } from "discord.js";

function HEXToVBColor(hex) {
  return parseInt(hex.replace("#", "0x"), 16);
}

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    let responseEmbed = {
      color: HEXToVBColor("#FFFFFF"),
      title: "Pong!",
      fields: [
        {
          name: "Ping",
          value: "Pinging...",
        },
      ],
    };

    const sent = await interaction.reply({
      embeds: [responseEmbed],
      fetchReply: true,
    });

    responseEmbed.fields = [
      {
        name: "Ping",
        value: `${sent.createdTimestamp - interaction.createdTimestamp}ms`,
      },
    ];

    sent.edit({ embeds: [responseEmbed] });
  },
};
