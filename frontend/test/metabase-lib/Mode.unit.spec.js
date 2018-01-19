import {
    metadata,
    DATABASE_ID,
    ORDERS_TABLE_ID,
    ORDERS_PK_FIELD_ID,
    ORDERS_CREATED_DATE_FIELD_ID,
    orders_raw_card
} from "__support__/sample_dataset_fixture";

import Question from "metabase-lib/lib/Question";

describe("Mode", () => {
    const rawDataQuestionMode = new Question(metadata, orders_raw_card).mode();
    const ordersQuestion = Question.create({
        databaseId: DATABASE_ID,
        tableId: ORDERS_TABLE_ID,
        metadata
    })
    const timeBreakoutQuestionMode = ordersQuestion
        .query()
        .addAggregation(["count"])
        .addBreakout(["datetime-field", ["field-id", 1], "day"])
        .question()
        .setDisplay("table")
        .mode();

    describe("forQuestion(question)", () => {
        describe("with structured query question", () => {
            // testbed for generative testing? see http://leebyron.com/testcheck-js

            it("returns `segment` mode with raw data", () => {});

            it("returns `metric` mode with >= 1 aggregations", () => {});

            it("returns `timeseries` mode with >=1 aggregations and date breakout", () => {});
            it("returns `timeseries` mode with >=1 aggregations and date + category breakout", () => {});

            it("returns `geo` mode with >=1 aggregations and an address breakout", () => {});

            it("returns `pivot` mode with >=1 aggregations and 1-2 category breakouts", () => {});

            it("returns `object` mode with 0 aggregations and filter on pk field", () => {
              expect(ordersQuestion
                  .query()
                  .addFilter(["=", ["field-id", ORDERS_PK_FIELD_ID], 1])
                  .question()
                  .mode().name())
              .toBe("object")
            })

            describe("with PK field that is also a DateTime field", () => {
              beforeEach(() => {
                metadata.fields[ORDERS_CREATED_DATE_FIELD_ID].special_type = "type/PK";
              })
              afterEach(() => {
                metadata.fields[ORDERS_CREATED_DATE_FIELD_ID].special_type = null;
              })

              it("returns `object` mode with 0 aggregations and filter w/ 'default' unit", () => {
                expect(ordersQuestion
                    .query()
                    .addFilter(["=", ["datetime-field", ["field-id", ORDERS_CREATED_DATE_FIELD_ID], "default"], "2018-01-01"])
                    .question()
                    .mode().name())
                .toBe("object")
              })

              it("returns `segment` mode with 0 aggregations and filter w/ no unit", () => {
                expect(ordersQuestion
                    .query()
                    .addFilter(["=", ["field-id", ORDERS_CREATED_DATE_FIELD_ID], "2018-01-01"])
                    .question()
                    .mode().name())
                .toBe("segment")
              })

              it("returns `segment` mode with 0 aggregations and filter w/ 'day' unit", () => {
                expect(ordersQuestion
                    .query()
                    .addFilter(["=", ["datetime-field", ["field-id", ORDERS_CREATED_DATE_FIELD_ID], "day"], "2018-01-01"])
                    .question()
                    .mode().name())
                .toBe("segment")
              })
            })

            it("returns `default` mode with >=0 aggregations and >=3 breakouts", () => {});
            it("returns `default` mode with >=1 aggregations and >=1 breakouts when first neither date or category", () => {});
        });
        it("with native query question", () => {
            it("returns `NativeMode` for empty query", () => {});
            it("returns `NativeMode` for query with query text", () => {});
        });
        it("with oddly constructed query", () => {
            it("should throw an error", () => {
                // this is not the actual behavior atm (it returns DefaultMode)
            });
        });
    });

    describe("name()", () => {
        it("returns the correct name of current mode", () => {});
    });

    describe("actions()", () => {
        describe("for a new question with Orders table and Raw data aggregation", () => {
            pending();
            it("returns a correct number of mode actions", () => {
                expect(rawDataQuestionMode.actions().length).toBe(3);
            });
            it("returns a defined metric as mode action 1", () => {
                expect(rawDataQuestionMode.actions()[0].name).toBe(
                    "common-metric"
                );
                // TODO: Sameer 6/16/17
                // This is wack and not really testable. We shouldn't be passing around react components in this imo
                // expect(question.actions()[1].title.props.children).toBe("Total Order Value");
            });
            it("returns a count timeseries as mode action 2", () => {
                expect(rawDataQuestionMode.actions()[1].name).toBe(
                    "count-by-time"
                );
                expect(rawDataQuestionMode.actions()[1].icon).toBe("line");
                // TODO: Sameer 6/16/17
                // This is wack and not really testable. We shouldn't be passing around react components in this imo
                // expect(question.actions()[2].title.props.children).toBe("Count of rows by time");
            });
            it("returns summarize as mode action 3", () => {
                expect(rawDataQuestionMode.actions()[2].name).toBe("summarize");
                expect(rawDataQuestionMode.actions()[2].icon).toBe("sum");
                expect(rawDataQuestionMode.actions()[2].title).toBe(
                    "Summarize this segment"
                );
            });
        });

        describe("for a question with an aggregation and a time breakout", () => {
            it("has pivot as mode actions 1 and 2", () => {
                expect(timeBreakoutQuestionMode.actions().length).toBe(3);
                expect(timeBreakoutQuestionMode.actions()[0].name).toBe(
                    "pivot-by-category"
                );
                expect(timeBreakoutQuestionMode.actions()[1].name).toBe(
                    "pivot-by-location"
                );
            });
        });
    });

    describe("actionsForClick()", () => {
        // this is action-specific so just rudimentary tests here showing that the actionsForClick logic works
        // Action-specific tests would optimally be in their respective test files
    });
});
