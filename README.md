## Obsidian Hypothesis Plugin (Community Plugin)

Obsidian Hypothesis (Community Plugin) is an unofficial plugin to synchronize [Hypothesis](https://hypothes.is/) **web** article highlights/annotations into your Obsidian Vault.

<a href="https://www.buymeacoffee.com/fatwombat"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=fatwombat&button_colour=BD5FFF&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00"></a>

### Features

- Sync web article highlights/annotations on Obsidian startup or manual trigger
- Update existing articles with new highlights and annotations
- Customization highlights through [Nunjucks](https://mozilla.github.io/nunjucks) template

## Usage

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
- `Highlights template`: Nunjuck template for rendering your highlights
- `Groups`: Add/remove group to be synced
- `Reset sync`: Wipe your sync history. Does not delete any previously synced highlights from your vault

### To sync all new highlights since previous update

- Click: Hypothesis ribbon icon
- Command: Sync new highlights
- Command: Resync deleted file
  > (Note: Files synced before v0.1.5 will need to reset sync history and delete all synced files to have this feature work properly)

## Limitations & caveats

- There is a limit of 1000 highlights per sync for performance reasons, if the limit is hit a message will be displayed and another manual sync will have to be issued: the new sync will start from the last synced update.
- Does not suport annotations on PDFs with "urn:x-pdf" URIs.

## Acknowledgement

Original author: https://github.com/weichenw

This project is inspired by Hady Ozman's [Obsidian Kindle Plugin](https://github.com/hadynz/obsidian-kindle-plugin).

## Do you find this plugin useful?

Buy the original author a coffee!

<a href="https://www.buymeacoffee.com/fatwombat"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=fatwombat&button_colour=BD5FFF&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00"></a>

Thank you for your support 🙏
