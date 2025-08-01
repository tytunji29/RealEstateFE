"use client";

import * as React from "react";
import RouterLink from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
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
import { getLoginSession } from "@/lib/auth/session";
import { useUser } from "@/hooks/use-user";

const schema = zod.object({
	email: zod.string().min(1, { message: "Email is required" }).email(),
	password: zod.string().min(1, { message: "Password is required" }),
});

type Values = zod.infer<typeof schema>;
const defaultValues = { email: "", password: "" } satisfies Values;

export function SignInForm(): React.JSX.Element {
	const router = useRouter();
	const { checkSession } = useUser();
	const [showPassword, setShowPassword] = React.useState<boolean>();
	const [isPending, setIsPending] = React.useState<boolean>(false);

	const {
		control,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

	// const onSubmit = React.useCallback(
	// 	async (values: Values): Promise<void> => {
	// 		setIsPending(true);
	// 		console.log(values);
	// 		const { error } = await authClient.signInWithPassword(values);

	// 		if (error) {
	// 			console.log("i reach here");
	// 			setError("root", { type: "server", message: error });
	// 			setIsPending(false);
	// 			return;
	// 		}

	// 		// Refresh the auth state
	// 		await checkSession?.();
	// 		setIsPending(false);

	// 		const all = getLoginSession();
	// 		if(all.role !== "agent") {
	// 		router.replace(paths.marketplace.landing);}
	// 		else {
	// 			router.replace(paths.dashboard.overview);
	// 		}
	// 	},
	// 	[checkSession, router, setError]
	// );
	const onSubmit = React.useCallback(
		async (values: Values): Promise<void> => {
			setIsPending(true);
			try {
				console.log("Submitting values:", values);

				const { error } = await authClient.signInWithPassword(values);

				if (error) {
					console.log("Sign-in error:", error);
					setError("root", { type: "server", message: error });
					return;
				}

				await checkSession?.();
				

				const session = getLoginSession();
				console.log("Session after login:", session);
				if (!session) {
					console.error("No session returned after login.");
					setError("root", { type: "server", message: "Session retrieval failed. Please try again." });
					return;
				}

				if (session.role?.toLocaleLowerCase() === "admin") {
					router.replace(paths.dashboard.overview);
				} else {
					
					router.replace(paths.marketplace.landing);
				}
			} catch (error) {
				console.error("Unexpected error during login:", error);
				setError("root", { type: "server", message: "An unexpected error occurred. Please try again." });
			} finally {
				setIsPending(false);
			}
		},
		[checkSession, router, setError]
	);

	return (
		<Stack spacing={4}>
			<Stack spacing={1}>
				<Typography variant="h4">Sign in</Typography>
				<Typography color="text.secondary" variant="body2">
					Don&apos;t have an account?{" "}
					<Link component={RouterLink} href={paths.auth.signUp} underline="hover" variant="subtitle2">
						Sign up
					</Link>
				</Typography>
			</Stack>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Stack spacing={2}>
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
					<div>
						<Link component={RouterLink} href={paths.auth.resetPassword} variant="subtitle2">
							Forgot password?
						</Link>
					</div>
					{errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
					<Button disabled={isPending} type="submit" variant="contained">
						Sign in
					</Button>
				</Stack>
			</form>
			<Alert color="warning">
				Use{" "}
				<Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
					email
				</Typography>{" "}
				and password <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit"></Typography>
			</Alert>
		</Stack>
	);
}
