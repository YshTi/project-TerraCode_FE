type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

async function parseJsonResponse(response: Response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function getErrorMessage(data: ApiErrorResponse, fallback: string) {
  return data.message || fallback;
}

export async function updateProfileName(name: string) {
  const response = await fetch("/api/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
    }),
  });

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося оновити профіль"));
  }

  return data;
}

export async function updateProfileAvatar(avatar: File) {
  const formData = new FormData();

  formData.append("avatar", avatar);

  const response = await fetch("/api/profile/avatar", {
    method: "PATCH",
    body: formData,
  });

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося оновити фото профілю"));
  }

  return data;
}

export async function updateProfilePassword({
  currentPassword,
  newPassword,
  confirmNewPassword,
}: {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}) {
  const response = await fetch("/api/profile/password", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
      confirmNewPassword,
    }),
  });

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося оновити пароль"));
  }

  return data;
}

export async function updateProfileEmail(
  email: string,
) {
  const response = await fetch("/api/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  });

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "Не вдалося надіслати лист для підтвердження нової пошти",
      ),
    );
  }

  return data;
}