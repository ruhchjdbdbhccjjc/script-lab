import React from "react";
import { SearchBox } from "office-ui-fabric-react/lib/SearchBox";
import { DefaultButton } from "office-ui-fabric-react/lib/Button";
import { Label } from "office-ui-fabric-react/lib/Label";
import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";

import Only from "common/build/components/Only";
import { matchesSearch, composeSolutionId } from "common/build/utilities/string";

import Content from "../Content";
import GalleryList from "../GalleryList";
import { enableGitHub } from "common/build/constants";

const localStorageKeyHasDismissedWarning = "has_dismissed_local_storage_warning";

interface IProps {
  solutions: ISolution[];
  openSolution: (solutionId: string) => void;
  activeSolution?: ISolution;
  gistMetadata: ISharedGistMetadata[];
  openGist: (gistMetadata: ISharedGistMetadata) => void;
  isSignedIn: boolean;
  signIn: () => void;
}

interface IState {
  filterQueryLowercase: string;
  localStorageWarningIsVisible: boolean;
}

class MySolutions extends React.Component<IProps> {
  state: IState = {
    filterQueryLowercase: "",
    localStorageWarningIsVisible: !localStorage.getItem(localStorageKeyHasDismissedWarning),
  };

  setFilterQuery = (filterQuery: string) =>
    this.setState({ filterQueryLowercase: filterQuery.toLowerCase() });

  hideLocalStorageWarning = () => {
    this.setState({ localStorageWarningIsVisible: false }, () =>
      localStorage.setItem(localStorageKeyHasDismissedWarning, "true"),
    );
  };

  focusOnFirstResult = (filterQuery: string) => {
    let firstSolution: ISolution | undefined = undefined;
    for (const solution of this.props.solutions) {
      if (
        matchesSearch(filterQuery, [
          process.env.NODE_ENV === "production"
            ? null
            : solution.id /* For Cypress test framework, need to include the solution ID so can search based on it */,
          solution.name,
          solution.description,
        ])
      ) {
        firstSolution = solution;
        break;
      }
    }

    if (!!firstSolution) {
      const galleryItem = document.getElementById(composeSolutionId(firstSolution.name));
      if (galleryItem) {
        galleryItem.focus();
      }
    }
  };

  render() {
    const { solutions, openSolution, activeSolution, gistMetadata, openGist, isSignedIn } =
      this.props;

    return (
      <Content title="My Snippets" description="Choose a snippet that you have saved">
        <SearchBox
          data-testid="solution-search"
          placeholder="Search your snippets"
          onChange={this.setFilterQuery}
          onSearch={this.focusOnFirstResult}
        />
        <GalleryList
          testId="my-solution-list"
          title="My snippets on this computer"
          messageBar={
            <Only when={this.state.localStorageWarningIsVisible}>
              <MessageBar
                messageBarType={MessageBarType.severeWarning}
                isMultiline={true}
                dismissButtonAriaLabel="Close"
                onDismiss={this.hideLocalStorageWarning}
              >
                Snippets you create get erased if you clear your browser cache. To save snippets
                permanently, export them from the Share menu.
              </MessageBar>
            </Only>
          }
          items={solutions
            .filter((solution) =>
              matchesSearch(this.state.filterQueryLowercase, [
                process.env.NODE_ENV === "production"
                  ? null
                  : solution.id /* For Cypress test framework, need to include the solution ID so can search based on it */,
                solution.name,
                solution.description,
              ]),
            )
            .map((sol, index) => ({
              key: sol.id,
              title: sol.name,
              index: index,
              description: sol.description,
              onClick: () => openSolution(sol.id),
              isActive: activeSolution && activeSolution.id === sol.id,
            }))}
        />
        {/*
        We want to show the "My shared gists" either when:
        1) You're not signed in, so that we can tell you that you should. And so that you still see this UI
        2) You have 1 or more gists.
        For signed in case but with empty gists, omit this section.
        */}
        {enableGitHub() && (!isSignedIn || gistMetadata.length > 0) && (
          <GalleryList
            title="My shared gists on GitHub"
            items={gistMetadata
              .filter((meta: ISharedGistMetadata) =>
                matchesSearch(this.state.filterQueryLowercase, [meta.title, meta.description]),
              )
              .map((gist, index) => ({
                key: gist.id,
                title: gist.title,
                description: gist.description,
                onClick: () => openGist(gist),
                index: index,
              }))}
          />
        )}
        {enableGitHub() && !isSignedIn && (
          <div style={{ margin: "1rem", marginLeft: "2rem" }}>
            <Label>You must be logged in to see your gists</Label>
            <DefaultButton
              text="Sign In"
              label="You must be logged in to see your gists"
              onClick={this.props.signIn}
            />
          </div>
        )}
      </Content>
    );
  }
}

export default MySolutions;
