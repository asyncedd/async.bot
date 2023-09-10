import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
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
    const confirm = new ButtonBuilder()
      .setCustomId("confirm")
      .setLabel("Confirm Ban")
      .setStyle(ButtonStyle.Danger);

    const cancel = new ButtonBuilder()
      .setCustomId("cancel")
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Secondary);

    let responseEmbed = {
      color: HEXToVBColor("#FFFFFF"),
      title: `Banning ${user.username}!`,
    };

    let sent = await interaction.reply({
      embeds: [responseEmbed],
      components: [new ActionRowBuilder().addComponents(cancel, confirm)],
      fetchReply: true,
    });

    const collectorFilter = (i) => i.user.id === interaction.user.id;

    try {
      const confirmation = await sent.awaitMessageComponent({
        filter: collectorFilter,
        time: 60_000,
      });

      if (confirmation.customId === "confirm") {
        interaction.guild.members
          .ban(user, { reason: `${reason} | By ${interaction.user}` })
          .then(() => {
            updateEmbed(`Banned ${user.username}`, `Reason: ${reason}`);
          })
          .catch(() => {
            updateEmbed(
              `I can't ban ${user.username}.`,
              `Please check your permissions because it may be the blame.\nIf you are 100% sure the issue is on our end, please open an issue ${hyperlink(
                "here",
                "https://github.com/asyncedd/async.bot"
              )}`
            );
          });
      } else if (confirmation.customId === "cancel") {
        updateEmbed(
          "OK.",
          `Canceling the action that is the public banning of ${user.username}`
        );
      }

      function updateEmbed(title, description) {
        confirmation.update({
          embeds: [{ title, description, color: HEXToVBColor("#FFFFFF") }],
          components: [
            new ActionRowBuilder().addComponents(
              cancel.setDisabled(true),
              confirm.setDisabled(true)
            ),
          ],
        });
      }
    } catch (e) {
      await interaction.editReply({
        embeds: [
          {
            title: `Not banning ${user.username}`,
            description: `Confirmation not received within 1 minute, cancelling`,
            color: HEXToVBColor("#FFFFFF"),
          },
        ],
        components: [
          new ActionRowBuilder().addComponents(
            cancel.setDisabled(true),
            confirm.setDisabled(true)
          ),
        ],
      });
    }
  },
};
