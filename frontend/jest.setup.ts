import "@testing-library/jest-dom";

// Mock para next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element,jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock para lucide-react
jest.mock("lucide-react", () => {
  const React = require("react");
  return {
    Check: () => React.createElement("span", { "data-testid": "icon-check" }),
    ChevronDown: () => React.createElement("span", { "data-testid": "icon-chevron-down" }),
    ChevronLeft: () => React.createElement("span", { "data-testid": "icon-chevron-left" }),
    ChevronRight: () => React.createElement("span", { "data-testid": "icon-chevron-right" }),
    Trash2: () => React.createElement("span", { "data-testid": "icon-trash" }),
    Edit: () => React.createElement("span", { "data-testid": "icon-edit" }),
    Plus: () => React.createElement("span", { "data-testid": "icon-plus" }),
    Loader2: () => React.createElement("span", { "data-testid": "icon-loader" }),
  };
});
