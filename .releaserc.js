module.exports = async (context) => {
    const isQa = context.branch.name === 'qa';

    return {
        branches: [
            "develop",
            { name: "qa", prerelease: "rc" },
            "master"
        ],
        plugins: [
            "@semantic-release/commit-analyzer",
            "@semantic-release/release-notes-generator",
            ...(!isQa
                ? [
                    "@semantic-release/changelog",
                    ["@semantic-release/npm", { npmPublish: false }],
                    [
                        "@semantic-release/git",
                        {
                            assets: ["CHANGELOG.md", "package.json"],
                            message:
                                "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
                        }
                    ]
                ]
                : []),
            ["@semantic-release/npm", { npmPublish: false }],
            ["@semantic-release/github", { assets: [] }]
        ],
        generateNotes: async (pluginConfig, context) => {
            if (isQa) {
                return ''; // suppress changelog in GitHub release for QA
            }
            return require('@semantic-release/release-notes-generator')(pluginConfig, context);
        }
    };
};
