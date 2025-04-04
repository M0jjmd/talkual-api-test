/**
 * order controller
 */

import { factories } from '@strapi/strapi'
import { isValidPostalCode } from '../services/coverageService'

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
  async donate(ctx): Promise<any> {
    try {
      const sanitizedQueryParams = await this.sanitizeQuery(ctx);
      const authenticatedUser = ctx.state.user;
      const { order_meta } = ctx.request.body;
      const orderID = ctx.params.id;
      const order = await strapi.service('api::order.order').findOne(sanitizedQueryParams, { populate: ['order_items', 'order_meta'] });

      /***** Rest of the code here *****/

      const { shipping_postcode, shipping_firstname } = order_meta;

      if (!order) {
        return ctx.badRequest('Pedido no encontrado');
      }

      if (!isValidPostalCode(shipping_postcode)) {
        return ctx.badRequest('Código postal inválido');
      }

      await strapi.service('api::order.order').update(orderID, {
        data: {
          status: 'cancelled',
        }
      });

      const newOrder = await strapi.service('api::order.order').create({
        data: {
          status: 'processing',
          type: 'donation',
          user: authenticatedUser.id,
        }
      });

      await strapi.service('api::order-meta.order-meta').create({
        data: {
          shipping_postcode,
          shipping_firstname,
          order: newOrder.id,
        }
      });

      for (const item of order.order_items) {
        await strapi.service('api::order-item.order-item').create({
          data: {
            quantity: item.quantity,
            sku: `${item.sku}-${newOrder.id}`,
            price: item.price,
            order: newOrder.id,
          },
        });
      };

      console.log(`${order_meta.shipping_firstname}, su pedido se enviará en breve.`);

      return ctx.send({ message: 'Pedido donado con éxito', newOrder });
    } catch (error) {
      console.error('Error exporting orders', error);
      return ctx.status = 500;
    }
  },
}));
