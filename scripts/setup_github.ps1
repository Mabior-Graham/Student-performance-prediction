# PowerShell Script to Automate GitHub Setup

# 1. Create Labels
Write-Host "Creating Standard Labels..."

$labels = @(
    @{name="good first issue"; color="7057ff"; description="Good for newcomers"},
    @{name="help wanted"; color="008672"; description="Extra attention is needed"},
    @{name="bug"; color="d73a4a"; description="Something isn't working"},
    @{name="enhancement"; color="a2eeef"; description="New feature or request"},
    @{name="documentation"; color="0075ca"; description="Improvements or additions to documentation"},
    @{name="performance"; color="d4c5f9"; description="Performance improvements"},
    @{name="ui/ux"; color="bfdadc"; description="User Interface and User Experience improvements"},
    @{name="beginner friendly"; color="0e8a16"; description="easy tasks for beginners"}
)

foreach ($label in $labels) {
    gh label create $label.name --color $label.color --description $label.description --force
}

# 2. Create Issues
Write-Host "Creating Issues..."

# Beginner Issues
gh issue create --title "Add docstrings to all utility functions" --body "## Description`nCurrently, some utility functions in `src/utils.py` lack detailed docstrings.`n`n## Task`n- Go through `src/utils.py``n- Add Google-style docstrings to every function.`n- Include arguments, return types, and exceptions.`n`n## Difficulty`nBeginner" --label "good first issue","documentation"
gh issue create --title "Improve README installation instructions" --body "## Description`nMake the manual installation section in README.md more detailed.`n`n## Task`n- Add steps for setting up a virtual environment.`n- Clarify dependencies.`n`n## Difficulty`nBeginner" --label "good first issue","documentation"
gh issue create --title "Fix responsiveness on mobile devices" --body "## Description`nThe dashboard UI has some padding issues on mobile screens.`n`n## Task`n- Test the dashboard on mobile view.`n- Fix padding and margins in `tailwind.config.ts` or CSS modules.`n`n## Difficulty`nBeginner" --label "good first issue","ui/ux","bug"
gh issue create --title "Add favicon to Next.js app" --body "## Description`nThe app currently uses the default Vercel favicon or none.`n`n## Task`n- Create/Find a student/education related favicon.`n- Add it to the `app` directory metadata.`n`n## Difficulty`nBeginner" --label "good first issue","ui/ux"
gh issue create --title "Create requirements-dev.txt" --body "## Description`nSeparate development dependencies (like pytest, black) from production requirements.`n`n## Task`n- Create `requirements-dev.txt`.`n- Move dev-only tools there.`n`n## Difficulty`nBeginner" --label "good first issue","enhancement"

# Intermediate Issues
gh issue create --title "Refactor Data Preprocessing Pipeline" --body "## Description`nThe `preprocessing.py` script is getting monolithic.`n`n## Task`n- Break down the `preprocess_data` function into proper transformers.`n- Use `sklearn.pipeline.Pipeline` more effectively.`n`n## Difficulty`nIntermediate" --label "enhancement","performance"
gh issue create --title "Add Unit Tests for API Endpoints" --body "## Description`nWe need to ensure the FastAPI backend is robust.`n`n## Task`n- Use `pytest` and `TestClient`.`n- Write tests for `/predict` and `/health` endpoints.`n`n## Difficulty`nIntermediate" --label "help wanted","enhancement"
gh issue create --title "Implement Logging for Backend" --body "## Description`nCurrently, we rely on print statements or default logging.`n`n## Task`n- Configure Python's `logging` module properly.`n- Log requests, errors, and predictions.`n`n## Difficulty`nIntermediate" --label "enhancement"
gh issue create --title "Add Loading Skeletons to Dashboard" --body "## Description`nWhen fetching data, the dashboard is blank.`n`n## Task`n- Implement loading skeletons for the charts and cards.`n- Improve percieved performance.`n`n## Difficulty`nIntermediate" --label "ui/ux","enhancement"
gh issue create --title "Docker Image Optimization" --body "## Description`nThe current Docker image is quite large.`n`n## Task`n- Use multi-stage builds.`n- Switch to a distroless or alpine base image if possible.`n`n## Difficulty`nIntermediate" --label "performance","enhancement"
gh issue create --title "Add Field Validation for API Input" --body "## Description`nThe Pydantic models need stricter validation.`n`n## Task`n- Add range checks (e.g., study hours cannot be negative).`n- Return proper 400 errors for invalid inputs.`n`n## Difficulty`nIntermediate" --label "bug","enhancement"
gh issue create --title "Visualize Error Distribution" --body "## Description`nAdd a plot to show the distribution of prediction errors (residuals).`n`n## Task`n- Generate the plot in `analysis.py`.`n- Expose it via an API endpoint or save as static asset.`n`n## Difficulty`nIntermediate" --label "enhancement","ui/ux"
gh issue create --title "Add Dark/Light Mode Toggle" --body "## Description`nThe app is currently Dark Mode only.`n`n## Task`n- Implement a toggle using Tailwind and Next.js themes.`n- Persist preference in local storage.`n`n## Difficulty`nIntermediate" --label "ui/ux","enhancement"

# Advanced Issues
gh issue create --title "Integrate XGBoost/Random Forest Model" --body "## Description`nLinear Regression is good, but Gradient Boosting is better.`n`n## Task`n- Train an XGBoost model.`n- Compare metrics with LR.`n- Integrate the better model into the pipeline.`n`n## Difficulty`nAdvanced" --label "enhancement","performance"
gh issue create --title "Implement User Authentication" --body "## Description`nAllow users to save their predictions.`n`n## Task`n- Integrate NextAuth.js (or Clerk) on frontend.`n- Add JWT auth to FastAPI backend.`n`n## Difficulty`nAdvanced" --label "help wanted","enhancement"
gh issue create --title "Set up CI/CD Pipeline" --body "## Description`nAutomate testing and deployment.`n`n## Task`n- Create a GitHub Action for running tests on push.`n- Create a deployment workflow for Vercel/Render.`n`n## Difficulty`nAdvanced" --label "enhancement"
gh issue create --title "Frontend E2E Testing with Cypress/Playwright" --body "## Description`nEnsure the frontend flow works end-to-end.`n`n## Task`n- Set up Cypress or Playwright.`n- Write a test case for the full prediction flow.`n`n## Difficulty`nAdvanced" --label "help wanted"
gh issue create --title "Create Public Rate Limiting Strategy" --body "## Description`nProtect the API from abuse.`n`n## Task`n- Implement rate limiting in FastAPI (e.g., using `slowapi`).`n`n## Difficulty`nAdvanced" --label "performance","enhancement"

Write-Host "Setup Complete!"
