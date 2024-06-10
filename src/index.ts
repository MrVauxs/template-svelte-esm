Hooks.on("getItemSheetHeaderButtons", (app: ItemSheetPF2e<any>, buttons: ApplicationHeaderButton[]) => {
    buttons.unshift({
        class: "my-button",
        icon: "fas fa-film",
        onclick: () => {
            new BasicApplication().render(true, { focus: true })
        },
        label: "Graphics",
    })
})