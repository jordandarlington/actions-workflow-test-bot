/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
export default (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");

  // example issue comment
  app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for opening this issue! (Example Functionality)",
    });
    return context.octokit.issues.createComment(issueComment);
  });

  // label pull request by base branch
  app.on("pull_request.opened", async (context) => {
    const pr = context.payload.pull_request;
    const baseBranch = pr.base.ref;
    const label = '';

    if (baseBranch === "main") {
      label = "main";
    } else if (baseBranch === "develop") {
      label = "develop";
    }

    const params = context.issue({
      labels: [label],
    });

    return context.octokit.issues.addLabels(params);
  });

  // add comment to pull request detailing check failures
  app.on("check_run.completed", async (context) => {
    const checkRun = context.payload.check_run;

    if (checkRun.conclusion === "failure") {
      const summary = checkRun.output.summary || "No summary provided.";
      const text = checkRun.output.text || "No additional details provided.";
      const comment = context.issue({
        body: `Check run failed: ${checkRun.name}\n\n**Summary:**\n${summary}\n\n**Details:**\n${text}`,
      });
      return context.octokit.issues.createComment(comment);
    }
  }
  );

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
