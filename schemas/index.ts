import * as z from 'zod';
import { UserRole } from '@prisma/client';

export const LoginSchema = z.object({
	email: z.string().email({
		message: 'Email is required',
	}),
	password: z.string().min(1, {
		message: 'Password is required',
	}),
	code: z.optional(z.string()),
});

export const RegisterSchema = z
	.object({
		email: z.string().email({
			message: 'Email is required',
		}),
		password: z.string().min(12, {
			message: 'Minimum 12 characters required',
		}),
		confirmPassword: z.string().min(12, {
			message: 'Password confirmation is required',
		}),
		name: z.string().min(1, {
			message: 'Name is required',
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ['confirmPassword'],
		message: 'Passwords do not match',
	});

export const ResetSchema = z.object({
	email: z.string().email({
		message: 'Email is required',
	}),
});

export const NewPasswordSchema = z.object({
	password: z.string().min(12, {
		message: 'Minimum of 12 characters required',
	}),
});

export const SettingsSchema = z
	.object({
		name: z.optional(z.string()),
		isTwoFactorEnabled: z.optional(z.boolean()),
		role: z.enum([UserRole.ADMIN, UserRole.USER]),
		email: z.optional(z.string().email()),
		password: z.optional(z.string().min(12)),
		newPassword: z.optional(z.string().min(12)),
	})
	.refine(
		(data) => {
			if (data.password && !data.newPassword) return false;

			return true;
		},
		{
			message: 'New password is required!',
			path: ['newPassword'],
		}
	)
	.refine(
		(data) => {
			if (data.newPassword && !data.password) return false;

			return true;
		},
		{
			message: 'Password is required!',
			path: ['password'],
		}
	);
