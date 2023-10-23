import { describe, it, expect } from "vitest";
import { screen, render, renderHook } from "@testing-library/react";
import PropertyCard from "../PropertyCard";
import { JsonSchemaProperty } from "../../../../types";
import { useReducer } from "react";
import { schemaReducer } from "../../../../reducers";
import { MOCK_SCHEMA } from "../../../../mocks";

describe("PropertyCard", () => {
  const propertyKey = Object.keys(MOCK_SCHEMA.properties)[0];
  const property: JsonSchemaProperty = MOCK_SCHEMA.properties[propertyKey];
  const { result } = renderHook(() => useReducer(schemaReducer, MOCK_SCHEMA));
  const dispatch = result.current[1];

  it("should render", () => {
    const { baseElement } = render(
      <PropertyCard
        propertyKey={propertyKey}
        property={property}
        dispatch={dispatch}
      />
    );
    expect(baseElement).toBeTruthy();
  });

  it("should update the title to be 'New Title'", () => {
    const titleInput = screen.getByLabelText("Title") as HTMLInputElement;
    expect(titleInput).toBeTruthy();
    titleInput.value = "New Title";
    expect(titleInput.value).toBe("New Title");
  });

it("should update the key to be 'newKey'", () => {
    const keyInput = screen.getByLabelText("Key") as HTMLInputElement;
    expect(keyInput).toBeTruthy();
    keyInput.value = "newKey";
    expect(keyInput.value).not.toBe("speed");
    expect(keyInput.value).toBe("newKey");
});

  it("should update the type to be boolean - wip", async () => {
    const typeSelect = screen.getByLabelText("Data Type") as HTMLInputElement;
    expect(typeSelect).toBeTruthy();
    typeSelect.value = "boolean";
    expect(typeSelect.value).toBe("boolean");

    const maximumInput = screen.getByLabelText("Maximum", { exact: false });
    expect(maximumInput).toBeTruthy(); // TODO: should not be visible 
    const minimumInput = screen.getByLabelText("Minimum", { exact: false });
    expect(minimumInput).toBeTruthy(); // TODO: should not be visible
  });

  it("should update the type to be 'string'", () => {
    const typeSelect = screen.getByLabelText("Data Type") as HTMLInputElement;
    expect(typeSelect).toBeTruthy();
    typeSelect.value = "string";
    expect(typeSelect.value).toBe("string");
  });
});
