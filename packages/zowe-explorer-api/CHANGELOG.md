# Change Log

All notable changes to the "zowe-explorer-api" extension will be documented in this file.

## Recent Changes

- Zowe Explorer extenders can now have their profile type's folder with meta file created in the /.zowe/profiles home directory upon initialization by calling the ZoweExplorerApiRegister.getExplorerExtenderApi().initForZowe(type: string, meta:imperative.ICommandProfileTypeConfiguration[]) during their activation with Zowe Explorer.

## `1.10.1`

- Initial release
