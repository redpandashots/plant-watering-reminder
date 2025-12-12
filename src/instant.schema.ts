// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react";

const _schema = i.schema({
  // Plant Watering Reminder Schema
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
      imageURL: i.string().optional(),
      type: i.string().optional(),
    }),
    // Watering history - tracks when each plant was watered
    wateringHistory: i.entity({
      plantId: i.string(),
      date: i.string(),
      timestamp: i.number(),
    }),
    // Custom plants added by users
    customPlants: i.entity({
      name: i.string(),
      emoji: i.string().optional(),
      wateringDays: i.number().optional(),
      baseWateringDays: i.number().optional(),
      color: i.string().optional(),
      careTips: i.json().optional(),
      seasonalAdjustments: i.json().optional(),
      createdAt: i.number().optional(),
    }),
  },
  links: {
    $usersLinkedPrimaryUser: {
      forward: {
        on: "$users",
        has: "one",
        label: "linkedPrimaryUser",
        onDelete: "cascade",
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "linkedGuestUsers",
      },
    },
  },
  rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
