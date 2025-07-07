module.exports = {
    branches: [
        "develop",
        { name: "qa", prerelease: "rc" },
        "master"
    ],
    plugins: [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        ["@semantic-release/npm", { npmPublish: false }],
        ["@semantic-release/github", { assets: [] }]
    ],
    // Branch-specific plugin override
    generateNotes: (pluginConfig, context) => {
        if (context.branch.name === 'qa') {
            return ''; // No changelog generated for QA
        }
        return require('@semantic-release/release-notes-generator')(pluginConfig, context);
    },
    prepare: async (pluginConfig, context) => {
        if (context.branch.name === 'qa') {
            // Skip changelog commit
            return;
        }
        const preparePlugins = [
            ["@semantic-release/changelog"],
            ["@semantic-release/npm", { npmPublish: false }],
            ["@semantic-release/git", {
                assets: ["CHANGELOG.md", "package.json"],
                message: "chore(release): ${nextRelease.version} [skip ci]"
            }]
        ];
        for (const plugin of preparePlugins) {
            await require(plugin[0])(plugin[1], context);
        }
    }
};
