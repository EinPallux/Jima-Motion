import { H2, LI, LegalPage, P, Strong, UL } from "../landing/LegalPage";

export default function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="24 July 2026"
      intro={
        <>
          Jima Motion is a free, browser-based motion-graphics tool. These plain-language terms cover
          how you can use it. By using Jima, you agree to them.
        </>
      }
    >
      <H2>The service</H2>
      <P>
        Jima Motion lets you create and export motion graphics — MP4, WebM, and GIF — entirely in
        your browser. It's provided free of charge, with no account required, and on an{" "}
        <Strong>“as-is”</Strong> basis. There are no paid plans, quotas, or watermarks.
      </P>

      <H2>Your content and your rights</H2>
      <P>
        You keep <Strong>all rights</Strong> to the text, images, and videos you create with Jima. We
        claim no ownership over your work or your exports.
      </P>
      <P>
        You are responsible for the content you make. By using Jima you confirm that you have the
        right to use any images, logos, text, or other material you add, and that your content is
        lawful and does not infringe anyone else's rights.
      </P>

      <H2>Acceptable use</H2>
      <UL>
        <LI>Don't use Jima to create or distribute content that is illegal, infringing, deceptive, hateful, or harmful.</LI>
        <LI>Don't use it to impersonate a person or organization, or to produce content designed to mislead.</LI>
        <LI>Don't attempt to disrupt, overload, reverse-engineer to harm, or otherwise abuse the service.</LI>
      </UL>

      <H2>No warranty</H2>
      <P>
        Jima Motion is provided <Strong>“as is”</Strong> and <Strong>“as available,”</Strong> without
        warranties of any kind, express or implied. We don't guarantee that it will be uninterrupted,
        error-free, or fit for a particular purpose. Because rendering and export happen on your own
        device, results and performance can vary by browser, hardware, and operating system.
      </P>

      <H2>Limitation of liability</H2>
      <P>
        To the fullest extent permitted by law, the project and the people who maintain it are not
        liable for any damages arising from your use of — or inability to use — Jima Motion,
        including lost work or content. Your projects are stored only in your own browser, so please
        keep your own copies of anything important; clearing your browser data or switching devices
        will remove them.
      </P>

      <H2>Intellectual property</H2>
      <P>
        The Jima Motion software, name, and template designs belong to the project and its
        maintainers. The templates are provided for you to use in your own posts and projects; your
        finished exports are yours to use freely. Fonts included in the tool are used under their
        respective open-source licenses.
      </P>

      <H2>Third-party platforms</H2>
      <P>
        Jima is not affiliated with, endorsed by, or sponsored by any social platform (for example
        TikTok, Instagram, YouTube, or others). Template names and layouts that resemble platform UIs
        are for creative reference only. When you publish content you made with Jima, follow the rules
        of whichever platform you post it to.
      </P>

      <H2>Changes to these terms</H2>
      <P>
        We may update these terms from time to time; the “Last updated” date above reflects the
        latest version. Continuing to use Jima after an update means you accept the revised terms.
      </P>

      <H2>Contact</H2>
      <P>
        Questions about these terms? Please reach out to the site owner through the channel where you
        were given access to this tool.
      </P>
    </LegalPage>
  );
}
