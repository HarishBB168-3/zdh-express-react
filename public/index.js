twofaForm = document.querySelector(".twofa");
twofaForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const twoFa = twofaForm.code.value;
  //   fetch("/twofa")

  console.log("Submitting : ", twoFa);

  const response = await fetch("/twofa", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      twoFa: twoFa,
    }),
  });

  console.log("Response is : ", response.json());
});
