<p align="center">
  <img src="./public/assets/og-image.png" />
</p>

# osu! beatmap heatmaps

This project is a website to generate beatmap heatmaps where lighter spots have more objects and darker spots have less.

[Check out the website](https://osu-heatmap.ekga.me/)

## Description

This is a useful tool for aspiring mappers to check the playfeld usage of a beatmap and to see how cool maps with playfield gimmicks look.

Supports loading .osu and .osz files and loading beatmap sets from the official osu! website by beatmap link.

## Running locally for development
Prerequisites:
- Node v21 - that's the version I worked with, but other versions might work too

Setup:
1. Clone the repository.
2. Open the project in a terminal.
3. Run `npm install` to install dependencies.
4. Copy `.env.example` to `.env` and fill out the enviroment variables.
5. Run `npm run dev` to launch the server in development mode.

## Version history
- 1.0
    - Initial release
    - Loading .osu and .osz files
    - Loading from URL
    - Loading from examples

## Acknowledgments
- [osu-classes](https://github.com/kionell/osu-classes), [osu-parsers](https://github.com/kionell/osu-parsers) and [osu-standard-stable](https://github.com/kionell/osu-standard-stable) - does the heavy lifting of parsing beatmaps and approximating slider paths. 
- The website uses [Nuxt](https://nuxt.com/) for client and server.
- [tinygradient](https://github.com/mistic100/tinygradient) - used for the color gradients.
