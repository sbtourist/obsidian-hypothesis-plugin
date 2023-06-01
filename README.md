## Obsidian Hypothesis Plugin (Forked Version)

This is a forked version of the [Obsidian Hypothesis (Community Plugin) plugin](https://github.com/weichenw/obsidian-hypothesis-plugin) to synchronize [Hypothesis](https://hypothes.is/) **web** article highlights/annotations into your Obsidian Vault.

## Features

- Sync web article highlights/annotations on Obsidian startup or manual trigger
- Update existing articles with new highlights and annotations
- Customization highlights through [Nunjucks](https://mozilla.github.io/nunjucks) template

This fork adds the following new features.

### Overwrite on Update

This is an optional setting to enable the overwrite of existing articles with newly synced highlights/annotations.

If this setting is disabled (as by default), newly synced highlights/annotations will be simply appended to the existing article: this might result in duplicated content in case of updates to existing highlights/annotations, as both the "old version" and the newly synced one will appear in the article.

Enabling this setting will instead rewrite the whole article with all its contents if any new highlight/annotation is found, which will get rid of any duplicates.

### Contextual Tags

This is an optional setting to enable tag-based navigation across highlights and annotations.

Each Hypothesis highlight is identified by a unique URL: such URL can be used in Hypothesis annotations to "link" to other highlights, see [this](https://hyp.is/DSnP4ABMEe6ETFtuwVGaJQ/h.readthedocs.io/en/latest/api-reference/) annotation for a practical example.

Connecting information together is fundamental for knowledge building, and it's at the heart of Obsidian itself: contextual tags allow to navigate the information contained in your Hypothesis highlights/annotations by leveraging the linking mechanism described above.

When this setting is enabled, upon syncing:
- A unique tag will be added to each highlight, based on its URL (please note such tag must be rendered in the Nunjucks template).
- When a Hypothesis URL is detected in an annotation, the related unique tag is added next to it.

Then, by clicking on any highlight unique tag, Obsidian will show all highlights/annotations containing such tag and hence referencing the highlight.

## Usage

The forked version must be installed as follows:
1. Install the [original](https://github.com/weichenw/obsidian-hypothesis-plugin) version via the comunity plugins.
2. Download the `main.js` and `manifest.json` files and copy them in the plugin directory for your vault (i.e. `<your-vault>/plugins/obsidian-hypothesis-plugin`).
3. Restart Obsidian.

After installing the plugin, configure the the settings of the plugin then initiate the first sync manually. Thereafter, the plugin can be configured to sync automatically or manually

Use Hypothesis icon on the side icon ribbon or command to trigger manual sync.

### Settings

- `Connect`: Enter [API Token](https://hypothes.is/account/developer) in order to pull the highlights from Hypohesis
- `Disconnect`: Remove API Token from Obsidian
- `Auto Sync Interval`: Set the interval in minutes to sync Hypothesis highlights automatically
- `Highlights folder`: Specify the folder location for your Hypothesis articles
- `Use domain folders`: Group generated files into folders based on the domain of the annotated URL
- `Sync on startup`: Automatically sync highlights when open Obsidian
- `Overwrite on Update`: Overwrite the whole doc when new annotations are found, to avoid duplicate annotations
- `Contextual Tags`: Enable tag-based navigation across annotations
- `Highlights template`: Nunjuck template for rendering your highlights
- `Groups`: Add/remove group to be synced
- `Reset sync`: Wipe your sync history. Does not delete any previously synced highlights from your vault

### To sync all new highlights since previous update

- Click: Hypothesis ribbon icon
- Command: Sync new highlights
- Command: Resync deleted file
  > (Note: Files synced before v0.1.5 will need to reset sync history and delete all synced files to have this feature work properly)

### Limitations & caveats

- There is a limit of 1000 highlights per sync for performance reasons, if the limit is hit a message will be displayed and another manual sync will have to be issued: the new sync will start from the last synced update.
- Does not suport annotations on PDFs with "urn:x-pdf" URIs.

## Acknowledgement

Original author: https://github.com/weichenw

## Do you find this plugin useful?

Buy the original author a coffee!

<a href="https://www.buymeacoffee.com/fatwombat"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=fatwombat&button_colour=BD5FFF&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00"></a>

Thank you for your support 🙏
