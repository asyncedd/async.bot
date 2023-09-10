import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  hyperlink,
} from "discord.js";

function HEXToVBColor(hex) {
  return parseInt(hex.replace("#", "0x"), 16);
}

export default {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Select a member and ban them.")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The member to ban")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("The reason").setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    let user = interaction.options.getUser("target");
    let reason = interaction.options.getString("reason") || "Not specified.";
    let responseEmbed = {
      color: HEXToVBColor("#FFFFFF"),
      title: `Banning ${user.username}!`,
    };

    let sent = await interaction.reply({
      embeds: [responseEmbed],
      fetchReply: true,
    });

    interaction.guild.members
      .ban(user, { reason: `${reason} | By ${interaction.user}` })
      .then(() => {
        const title = `Banned ${user.username}.`;
        const description = `Reason: ${reason}`;

        updateEmbed(title, description);
      })
      .catch(() => {
        updateEmbed(
          `I can't ban ${user.username}.`,
          `Please check your permissions because it may be the blame.\nIf you are 100% sure the issue is on our end, please open an issue ${hyperlink(
            "here",
            "https://github.com/asyncedd/async.bot"
          )}`,
          ephemeral
        );
      });

    function updateEmbed(title, description) {
      sent.edit({
        embeds: [{ title, description, color: HEXToVBColor("#FFFFFF") }],
      });
    }
  },
};
