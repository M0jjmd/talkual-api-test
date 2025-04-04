interface order {
    status: "pending" | "processing" | "cancelled";
    type: "normal" | "donation";
};

export const defaultOrderData: order = {
    status: "pending",
    type: "normal",
};

export const createOrder = async (data = {}) => {
    return strapi.entityService.create("api::order.order", {
        data: {
            ...defaultOrderData,
            ...data,
        },
    });
};
