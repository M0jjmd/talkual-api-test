import { describe, beforeAll, afterAll, it, expect } from "@jest/globals";
import request from "supertest";
import {
    setupStrapi,
    stopStrapi,
} from "../helpers/strapi";
import { defaultOrderData, createOrder } from "./factory";

/** this code is called once before any test is called */
beforeAll(async () => {
    console.log("Iniciando setupStrapi...");
    await setupStrapi(); // singleton so it can be called many times
    console.log("Strapi iniciado.");
}, 1000000);

/** this code is called once before all the tested are finished */
afterAll(async () => {
    await stopStrapi();
});

describe("Order Controller Tests", () => {
    beforeAll(async () => {
    });

    it("should create an order successfully", async () => {
    });

    it("should fail to donate an order with an invalid postal code", async () => {
    });

    it("should successfully donate an order", async () => {
    });
});