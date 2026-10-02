# Technical task — "Mini ТОРО" (maintenance)

**Time:** about 3–4 hours. **Tools:** Node.js 18 or newer, any editor. No other packages are needed.

You get a small JavaScript project from a maintenance app used at factories. It works with three kinds of data:

| Object | What it is |
|---|---|
| **Equipment** | A machine at a factory (press, compressor, crane…). |
| **Notification** | A report of a problem: "the hose is leaking". Anyone can create one. |
| **Order** | Planned repair work for a notification: operations, work centers, planned hours. |

The data is in `data/*.json`, in the format that SAP systems use for their OData API: `{ "d": { "results": [ ... ] } }`.

Run the tests at any time:

```
npm test
```

At the start most tests fail. Your job is to make them pass, then write your answers in `ANSWERS.md`. **Don't edit the test files or the files in `data/`.** We check your work with extra tests of our own.

---

## Part 1 — Functions (30 points)

Implement three functions in `src/tasks.js`. You can add helper functions and use anything in `src/utils.js`.

### 1.1 `getOpenOrders(orders, plant)`
Return the **open** orders of the given plant (`Plant`), sorted.

- An order is **closed** if its `SystemStatus` contains `TECO` or `CLSD`. `SystemStatus` can hold several statuses separated by spaces, for example `"REL TECO"`. All other orders are open.
- Sort by:
  1. `Priority`, ascending as a **number** (`"1"` is the most urgent). An empty priority goes last.
  2. then `BasicStartDate`, earliest first (use `parseODataDate`);
  3. then `OrderId`, ascending.
- Don't change the input array.

### 1.2 `countNotificationsByEquipment(notifications)`
Return an object `{ equipmentId: numberOfNotifications }`.

- Users sometimes type the equipment number without leading zeros (`"10000101"` instead of `"000000000010000101"`). Use `normalizeEquipmentId` so both forms are counted together. Keys are in the full 18-character form.
- Skip notifications with no equipment.

### 1.3 `validateNotification(notification, equipmentList, config)`
Check a new notification before it is saved. Return `{ valid, errors }`, where `valid` is `true` only when `errors` is empty.

`notification` has the fields `NotificationType`, `Description`, `EquipmentId`, and optionally `MalfunctionStart` and `MalfunctionEnd` (ISO date strings such as `"2026-10-01T08:00:00Z"`).

Error codes:

| Code | When |
|---|---|
| `REQUIRED:<Field>` | A field from `config.notification.requiredFields` is empty: missing, `null`, `""` or only spaces. |
| `DESCRIPTION_TOO_LONG` | `Description` is longer than `config.notification.descriptionMaxLength`. |
| `DATES_INVALID` | A malfunction date is given but can't be read as a date, or the start is **after** the end. Equal dates are fine. |
| `EQUIPMENT_NOT_FOUND` | `EquipmentId` is filled in but isn't in `equipmentList`. A short form like `"10000101"` must still be found. |

The rules must come from `config`. Don't hard-code `40` or the list of fields. Get `config` with `loadConfig(plant)` from `src/config.js`.

---

## Part 2 — Bugs (30 points)

Users of factory A report three problems:

1. "All dates on the screen show the **previous month**."
2. "The app **crashes** when I open order 4000105."
3. "Total planned hours for order 4000101 shows **`02.51.5`** instead of 4."

The causes are in `src/utils.js`. Fix them there (you don't have to change anything else). In `ANSWERS.md`, write for each bug **what the cause was** and **how you fixed it**, 1–3 sentences each.

---

## Part 3 — A new factory (20 points)

The app is being rolled out to **plant 2000**. Settings are in `config/`: `default.json` holds the company standard, and `plant-<number>.json` holds **only the differences** for one plant. Read `src/config.js` to see how they are merged.

Plant 2000 needs:

- name **"Factory B"**
- interface language **Uzbek** (`"uz"`)
- work centers **MECH-B, ELEC-B, WELD-B**
- the **MalfunctionStart** field must be **visible** and **mandatory**, in addition to the standard mandatory fields
- everything else, including sync settings, as in the **company standard**

Plant 1000 must keep working **exactly as before**.

In `ANSWERS.md`, explain in 1–2 sentences why your file looks the way it does.

---

## Part 4 — Short questions (10 points)

Answer in `ANSWERS.md`, in your own words:

1. Look at the data. How are equipment, notifications and orders connected? Why do you think a problem report and the repair work are kept as separate objects?
2. The dates in the data look like `/Date(1790000000000)/`. What is this number? Why might a system send dates like this instead of `"05.10.2026"`?
3. A user says: "I completed an order on the tablet but it didn't reach SAP." What would you check, and in what order?

---

## Part 5 — Bonus (optional, up to +10 points)

**Only if you have time left after Parts 1–4.** Skipping it costs nothing. Choose **one** option below; doing more than one doesn't add more points. Put your work in the `bonus/` folder and write 3–5 sentences about it in `ANSWERS.md`. Any language, library or tool is fine. We grade your ideas and how you explain them, not the size of the result.

**5A — Dashboard.** Make something a maintenance manager would open every morning, using the data in `data/`: an HTML page, a terminal report, a spreadsheet, anything. You decide what's most important to show and how.

**5B — Working offline.** Technicians often have no internet in the workshop. Find out how mobile apps store changes offline and send them later. Write a short design (1 page max, `bonus/SYNC_DESIGN.md`): how changes are saved and sent, and what should happen if the same order was changed in SAP by someone else while the tablet was offline. A small code example is welcome but not required.

**5C — Which machines cause the most trouble?** `data/history.json` has 12 months of breakdowns with start and end times. Find out what **MTBF** and **MTTR** mean in maintenance, calculate them for each piece of equipment, and tell us which 3 machines a manager should focus on and **why**. Show how you calculated it.

**5D — Your idea for technicians.** Suggest one feature that would make a technician's job easier: for example scanning a QR code on a machine, taking a photo of a defect, voice input in a noisy workshop, or working in gloves. Look at how existing apps solve it. Describe the idea (who, problem, solution) in `bonus/IDEA.md` with a simple sketch or mock-up. A small working prototype is a plus.

---

## How to submit

- Send the whole project folder as a ZIP, or a link to a Git repository.
- You can use documentation, the internet and AI tools. **In the interview you'll be asked to explain your code and make a small change to it live.**
- Code readability counts for 10 points: clear names, no duplication, simple logic.
