import { H2, LI, LegalPage, P, Strong, UL } from "../landing/LegalPage";

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="24 July 2026"
      intro={
        <>
          Jima Motion is built to collect as little as technically possible. There are no accounts,
          no analytics, and nothing you create is ever uploaded to a server — it all happens in your
          browser, on your device.
        </>
      }
    >
      <H2>The short version</H2>
      <UL>
        <LI>
          <Strong>No account, ever.</Strong> There is no sign-up, login, or profile.
        </LI>
        <LI>
          <Strong>No tracking.</Strong> No analytics, no advertising, no third-party trackers, and no
          cookies used to identify or follow you.
        </LI>
        <LI>
          <Strong>Your content never leaves your device.</Strong> The text and images you add are
          rendered entirely in your browser and are never sent to us or anyone else.
        </LI>
        <LI>
          <Strong>You stay in control.</Strong> You can wipe everything Jima has saved at any time.
        </LI>
      </UL>

      <H2>What stays on your device</H2>
      <P>
        So you can pick up where you left off, Jima saves your current project — the template you
        chose, your text, colors, settings, and references to images you added — in your browser's
        own storage (<Strong>localStorage</Strong> and <Strong>IndexedDB</Strong>). This data lives
        only on your device. It is never transmitted to us, and we have no way to read it.
      </P>
      <P>
        You can delete it whenever you like using the <Strong>“Clear saved data”</Strong> button in
        the footer, or by clearing your browser's site data. Clearing it removes your saved project
        from this browser permanently.
      </P>

      <H2>Your images and media</H2>
      <P>
        Images you drop in are read and drawn entirely within your browser — they are not uploaded.
        When you export a video or GIF, the file is generated on your device using your browser's own
        graphics and encoding, and saved through a normal download. Your media and exports stay with
        you.
      </P>

      <H2>What we don't do</H2>
      <UL>
        <LI>We don't run analytics or telemetry, and we don't measure how you use the app.</LI>
        <LI>We don't show ads or embed third-party advertising or tracking scripts.</LI>
        <LI>We don't use cookies to identify, profile, or follow you across sites.</LI>
        <LI>We don't sell, rent, or share personal data — there simply isn't any to sell.</LI>
      </UL>

      <H2>Hosting and server logs</H2>
      <P>
        The site is served as static files by our hosting provider. Like virtually every website, the
        host may automatically record standard technical request information — such as your IP
        address, browser type, and a timestamp — in short-lived server logs used only for security
        and reliability. We don't use these logs to identify you and don't combine them with anything
        else. Jima itself sends no data about you or your work back to us.
      </P>

      <H2>Fonts and assets</H2>
      <P>
        All fonts and assets are served from the same site (self-hosted). While you use Jima, the app
        does not call out to third-party font or asset networks, so browsing the tool doesn't quietly
        share your visit with anyone else.
      </P>

      <H2>Children</H2>
      <P>
        Jima Motion is a general-audience creative tool and is not directed to children under 13. It
        does not knowingly collect personal information from anyone, including children.
      </P>

      <H2>Changes to this policy</H2>
      <P>
        If this policy changes, we'll update the “Last updated” date above. Because Jima collects
        nothing and requires no account, we can't notify you individually — please check back here if
        you'd like to stay current.
      </P>

      <H2>Contact</H2>
      <P>
        Questions about your privacy on Jima Motion? Please reach out to the site owner through the
        channel where you were given access to this tool.
      </P>
    </LegalPage>
  );
}
