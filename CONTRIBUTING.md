# Contributing to GitShip

- [Contributing to GitShip](#contributing-to-gitship)
  - [How to report a Bug](#how-to-report-a-bug)
  - [How to request a Feature](#how-to-request-a-feature)
  - [Development Workflow](#development-workflow)
    - [Local Setup](#local-setup)
    - [Setup Custom Hooks](#setup-custom-hooks)
  - [Commit Message Guidelines](#commit-message-guidelines)
    - [Valid Types](#valid-types)
  - [Coding Standards](#coding-standards)
  - [Licensing](#licensing)

## How to report a Bug

If you encounter a bug, please use our **Bug Report** template when opening an issue. Be prepared to provide:

- **Steps to Reproduce**: Detailed actions that lead to the bug.
- **Expected vs. Actual Behavior**: What should have happened versus what did happen.
- **Affected Components**: Specify if it impacts the Infrastructure (Go), Control Panel (Python), or Dashboard (React).
- **Environment Details**: Your Docker version, OS, and browser.
- **Log Output**: Relevant terminal or console logs.

## How to request a Feature

We encourage new ideas! Please use the **Feature Request** template to explain:

- **Problem Statement**: Detailed explanation of the need.
- **Proposed Implementation**: How you'd like to see the feature work.
- **Affected Components**: Which parts of the distributed architecture are involved.

## Development Workflow

The GitShip project consists of three main modules. Ensure you have the appropriate environments set up for the part you are working on:

1. **Infrastructure (Go)**: Requires Go 1.25.4+.
2. **Control Panel (Python)**: Requires Python 3.13+ and Poetry.
3. **Dashboard (React)**: Requires Node.js and npm/vite.

### Local Setup

- Clone the repository.
- Configure the necessary environment variables as defined in `infrastructure/env.json` and the Control Panel's `.env` requirements.
- The project uses Git hooks for commit message validation.

### Setup Custom Hooks

Use the following command to apply the custom hook, it blocks the commit if the commit message is not following a specific standard

```sh
git config core.hooksPath .githooks
```

## Commit Message Guidelines

GitShip enforces **Conventional Commits** to maintain a clean and automated history. Your commit messages must follow this regex-validated format:

`<type>(<optional scope>): <description>`

### Valid Types

- `feat`: A new feature.
- `fix`: A bug fix.
- `docs`: Documentation changes.
- `style`: Formatting/style changes.
- `refactor`: Code changes that neither fix a bug nor add a feature.
- `test`: Adding or updating tests.
- `chore`: Routine tasks like updating dependencies.
- `build`: Changes affecting the build system.
- `ci`: Changes to CI configurations.
- `perf`: Performance improvements.

**Example:** `feat(auth): add login functionality`

## Coding Standards

- **Go**: Follow standard Go formatting (`gofmt`).
- **Python**: We use **Ruff** for linting and formatting. Ensure your code passes Ruff checks before submitting.
- **React**: Use TypeScript and ensure there are no ESLint errors.

## Licensing

By contributing to GitShip, you agree that your contributions will be licensed under the project's [MIT License](./LICENSE).
