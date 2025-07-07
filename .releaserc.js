module.exports = {
    branches: [
        { name: "qa", prerelease: "rc" },
        'master'
    ],
    "plugins": [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        "@semantic-release/github"
    ]
};
