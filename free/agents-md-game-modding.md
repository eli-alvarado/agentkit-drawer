# AGENTS.md: game modding and small game tools
<!-- Free template from AgentKit Drawer (https://agentkitdrawer.com). MIT licensed. Fill every <<FILL>>. -->

## Project
- What this is: <<FILL: e.g. "Minecraft Fabric mod adding copper golems" / "Godot 4 level editor plugin" / "Unity save-file inspector">>
- Target game/engine + exact version: <<FILL: e.g. Minecraft 1.21.1 + Fabric Loader 0.16, Godot 4.3, Unity 2022.3 LTS>>
- Mod loader / SDK / API: <<FILL: Fabric/Forge/NeoForge, BepInEx/Harmony, Godot EditorPlugin, Unity Editor scripting>>
- Language + build: <<FILL: Java 21 + Gradle, C# + dotnet, GDScript, Python>>

## Commands
- Build: <<FILL>>
- Run in game / dev client: <<FILL>>
- Tests (if any): <<FILL>>
- Package release: <<FILL>>

## Hard rules
- **Pin the version.** Only use APIs that exist in the exact game/engine/loader version above. If unsure an API exists in this version, say so and check the docs or decompiled source instead of guessing.
- **Never edit vanilla/engine files or decompiled sources.** Change behavior through the loader's hooks: mixins, Harmony patches, events, signals, editor plugins.
- **Smallest possible patch.** Prefer events/hooks over mixins/Harmony; prefer a targeted injection point over an overwrite. Explain why each patch is needed.
- **Compatibility first.** Don't break other mods: no global overwrites, namespace all IDs/registries/assets with `<<FILL: modid>>`, and keep config defaults close to vanilla.
- **Never touch user saves without a backup.** Tools that read or write save files, worlds or project files must work on a copy, or create a timestamped backup first.
- **No network, telemetry or auto-updates** unless explicitly requested.
- **Respect the game's EULA and licenses.** Don't copy proprietary assets or code into the repo; reference them at runtime.
- **Data-driven over hard-coded.** Put tunables (drop rates, speeds, costs) in config/data files.

## Workflow
1. Restate the goal in one line and list the files you'll touch.
2. Make one small change, then build and launch the dev client / editor.
3. Report what you verified in game, and what you could not verify.
4. Update CHANGELOG.md and the mod/tool version for user-facing changes.

## Small game tools (editors, converters, inspectors)
- CLI first, with `--dry-run` for anything that writes files.
- Validate inputs, and fail with a clear message instead of writing corrupt output.
- Keep file formats documented in `docs/formats.md` as you discover them.

## Done means
Builds cleanly, loads in the target version without errors in the log, doesn't break a fresh vanilla world/project, and the change is described in plain words.
