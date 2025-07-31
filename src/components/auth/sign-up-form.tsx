"use client";

import * as React from "react";
import RouterLink from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { EyeSlashIcon } from "@phosphor-icons/react/dist/ssr/EyeSlash";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { paths } from "@/paths";
import { authClient } from "@/lib/auth/client";
import { useUser } from "@/hooks/use-user";

const schema = zod.object({
	fullName: zod.string().min(1, { message: "First name is required" }),
	phoneNumber: zod.string().min(1, { message: "PhoneNumber is required" }),
	address: zod.string().min(1, { message: "Address is required" }),
	email: zod.string().min(1, { message: "Email is required" }).email(),
	password: zod.string().min(6, { message: "Password should be at least 6 characters" }),
	terms: zod.boolean().refine((value) => value, "You must accept the terms and conditions"),
});

type Values = zod.infer<typeof schema>;

const defaultValues = {
	fullName: "",
	phoneNumber: "",
	email: "",
	password: "",
	address: "",
	terms: false,
} satisfies Values;

export function SignUpForm(): React.JSX.Element {
	const router = useRouter();

	const { checkSession } = useUser();

	const [isPending, setIsPending] = React.useState<boolean>(false);

	const [showPassword, setShowPassword] = React.useState<boolean>();
	const {
		control,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

	// const onSubmit = React.useCallback(
	// 	async (values: Values): Promise<void> => {
	// 		setIsPending(true);

	// 		try {
	// 			const response = await fetch(`${APIURL}/Users/register`, {
	// 				method: "POST",
	// 				headers: {
	// 					"Content-Type": "application/json",
	// 				},
	// 				body: JSON.stringify({
	// 					fullName: values.fullName,
	// 					email: values.email,
	// 					password: values.password,
	// 					phoneNumber: values.phoneNumber,
	// 					address: values.address,
	// 					role: values.role,
	// 				}),
	// 			});
	// 			const data = await response.json();
	// 			if (!response.ok || !data.Status) {
	// 				// in catch:
	// 				showAlert("error", data.message || "Registration failed. Please try again.");
	// 			}

	// 			await showAlert("success", data.Message || "Registration successful!");

	// 			// Refresh auth state if needed
	// 			await checkSession?.();

	// 			// Redirect to login or dashboard
	// 			router.push(paths.auth.signIn);
	// 		} catch (error: any) {
	// 			console.error(error);
	// 			setError("root", { type: "server", message: error.message });
	// 		} finally {
	// 			setIsPending(false);
	// 		}
	// 	},
	// 	[checkSession, router, setError]
	// );
	const onSubmit = React.useCallback(
		async (values: Values): Promise<void> => {
			setIsPending(true);
			try {
				const { error } = await authClient.signUp(values);
				if (error) {
					setError("root", { type: "server", message: error });
					return;
				}

				await checkSession?.();
				router.push(paths.auth.signIn);
			} finally {
				setIsPending(false);
			}
		},
		[checkSession, router, setError]
	);

	return (
		<Stack spacing={3}>
			<Stack spacing={1}>
				<Typography variant="h4">Sign up</Typography>
				<Typography color="text.secondary" variant="body2">
					Already have an account?{" "}
					<Link component={RouterLink} href={paths.auth.signIn} underline="hover" variant="subtitle2">
						Sign in
					</Link>
				</Typography>
			</Stack>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Stack spacing={2}>
					<Controller
						control={control}
						name="fullName"
						render={({ field }) => (
							<FormControl error={Boolean(errors.fullName)}>
								<InputLabel>Full Name</InputLabel>
								<OutlinedInput {...field} label="First name" />
								{errors.fullName ? <FormHelperText>{errors.fullName.message}</FormHelperText> : null}
							</FormControl>
						)}
					/>
					<Controller
						control={control}
						name="email"
						render={({ field }) => (
							<FormControl error={Boolean(errors.email)}>
								<InputLabel>Email address</InputLabel>
								<OutlinedInput {...field} label="Email address" type="email" />
								{errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
							</FormControl>
						)}
					/>
					<Controller
						control={control}
						name="password"
						render={({ field }) => (
							<FormControl error={Boolean(errors.password)}>
								<InputLabel>Password</InputLabel>
								<OutlinedInput
									{...field}
									endAdornment={
										showPassword ? (
											<EyeIcon
												cursor="pointer"
												fontSize="var(--icon-fontSize-md)"
												onClick={(): void => {
													setShowPassword(false);
												}}
											/>
										) : (
											<EyeSlashIcon
												cursor="pointer"
												fontSize="var(--icon-fontSize-md)"
												onClick={(): void => {
													setShowPassword(true);
												}}
											/>
										)
									}
									label="Password"
									type={showPassword ? "text" : "password"}
								/>
								{errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
							</FormControl>
						)}
					/>

					<Controller
						control={control}
						name="phoneNumber"
						render={({ field }) => (
							<FormControl error={Boolean(errors.phoneNumber)}>
								<InputLabel>Phone Number</InputLabel>
								<OutlinedInput {...field} label="Last name" />
								{errors.phoneNumber ? <FormHelperText>{errors.phoneNumber.message}</FormHelperText> : null}
							</FormControl>
						)}
					/>
					<Controller
						control={control}
						name="address"
						render={({ field }) => (
							<FormControl error={Boolean(errors.address)}>
								<InputLabel>Address</InputLabel>
								<OutlinedInput {...field} label="Last name" />
								{errors.address ? <FormHelperText>{errors.address.message}</FormHelperText> : null}
							</FormControl>
						)}
					/>
					

					<Controller
						control={control}
						name="terms"
						render={({ field }) => (
							<div>
								<FormControlLabel
									control={<Checkbox {...field} />}
									label={
										<React.Fragment>
											I have read the <Link>terms and conditions</Link>
										</React.Fragment>
									}
								/>
								{errors.terms ? <FormHelperText error>{errors.terms.message}</FormHelperText> : null}
							</div>
						)}
					/>
					{errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
					<Button disabled={isPending} type="submit" variant="contained">
						Sign up
					</Button>
				</Stack>
			</form>
			<Alert color="warning">Created users are not persisted</Alert>
		</Stack>
	);
}
