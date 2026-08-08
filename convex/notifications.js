import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const listForUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) =>
    ctx.db.query('notifications').withIndex('by_user', (q) => q.eq('userId', args.userId)).order('desc').collect(),
})

export const unreadCount = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const unread = await ctx.db
      .query('notifications')
      .withIndex('by_user_and_read', (q) => q.eq('userId', args.userId).eq('read', false))
      .collect()
    return unread.length
  },
})

export const create = mutation({
  args: {
    userId: v.id('users'),
    type: v.union(v.literal('order_update'), v.literal('price_drop'), v.literal('back_in_stock'), v.literal('system')),
    title: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('notifications', { ...args, read: false, createdAt: Date.now() })
  },
})

export const markRead = mutation({
  args: { id: v.id('notifications') },
  handler: async (ctx, args) => ctx.db.patch(args.id, { read: true }),
})

export const markAllRead = mutation({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const unread = await ctx.db
      .query('notifications')
      .withIndex('by_user_and_read', (q) => q.eq('userId', args.userId).eq('read', false))
      .collect()
    await Promise.all(unread.map((n) => ctx.db.patch(n._id, { read: true })))
  },
})
