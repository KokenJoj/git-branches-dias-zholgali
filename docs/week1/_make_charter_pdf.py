from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

font_path = Path(r"C:\Windows\Fonts\arial.ttf")
font_bold = Path(r"C:\Windows\Fonts\arialbd.ttf")
pdfmetrics.registerFont(TTFont("ArialBody", str(font_path)))
pdfmetrics.registerFont(TTFont("ArialBold", str(font_bold)))

out = Path(__file__).resolve().parents[2] / "Week1_Project_Charter.pdf"

doc = SimpleDocTemplate(
    str(out),
    pagesize=A4,
    leftMargin=18 * mm,
    rightMargin=18 * mm,
    topMargin=16 * mm,
    bottomMargin=16 * mm,
)

title = ParagraphStyle(
    "TitleCustom",
    fontName="ArialBold",
    fontSize=16,
    spaceAfter=4,
    textColor=colors.black,
)
subtitle = ParagraphStyle(
    "SubCustom",
    fontName="ArialBody",
    fontSize=11,
    spaceAfter=10,
    textColor=colors.black,
)
h2 = ParagraphStyle(
    "H2Custom",
    fontName="ArialBold",
    fontSize=12,
    spaceBefore=10,
    spaceAfter=4,
    textColor=colors.black,
)
body = ParagraphStyle(
    "BodyCustom",
    fontName="ArialBody",
    fontSize=10.5,
    leading=14,
    alignment=TA_JUSTIFY,
    spaceAfter=6,
)
bullet = ParagraphStyle(
    "BulletCustom",
    fontName="ArialBody",
    fontSize=10.5,
    leading=14,
    leftIndent=14,
    spaceAfter=3,
)
meta = ParagraphStyle(
    "MetaCustom",
    fontName="ArialBody",
    fontSize=10.5,
    leading=14,
    spaceAfter=4,
)
cell = ParagraphStyle(
    "CellCustom",
    fontName="ArialBody",
    fontSize=10,
    leading=12,
)
cellb = ParagraphStyle(
    "CellBold",
    fontName="ArialBold",
    fontSize=10,
    leading=12,
)

story = []
story.append(Paragraph("Project Charter - GreenWeekend", title))
story.append(Paragraph("Smart Greenhouse, Week 1", subtitle))
story.append(
    Paragraph(
        "<b>Team:</b> Zholgali Dias, Basiev David, Umbetalieva Adelya, Marat Gaukhar",
        meta,
    )
)
story.append(
    Paragraph(
        "<b>Repository:</b> (add GitHub link after the repository is created)",
        meta,
    )
)
story.append(Spacer(1, 4))

story.append(Paragraph("1. App name and description", h2))
story.append(Paragraph("<b>Name:</b> GreenWeekend", body))
story.append(
    Paragraph(
        "<b>One sentence:</b> GreenWeekend helps weekend dacha owners keep their "
        "greenhouse healthy between Friday and Sunday visits.",
        body,
    )
)

story.append(Paragraph("2. Target user", h2))
story.append(
    Paragraph(
        "We focus on a family that has a small greenhouse at the dacha and lives "
        "in the city most of the week. They usually come on Friday or Saturday and "
        "leave on Sunday. During the week nobody is there to check temperature, "
        "soil moisture or if the ventilation was left open.",
        body,
    )
)
story.append(
    Paragraph(
        "Because of that, plants often dry out or overheat before the next weekend. "
        "Many of these people are not professional farmers. They forget watering "
        "and planting dates, do not know which crops fit the season, and want a "
        "simple answer: is the greenhouse OK, and what should we do next. Other "
        "family members may use the same app on their phones.",
        body,
    )
)

story.append(Paragraph("3. Our extra feature", h2))
story.append(Paragraph("<b>Plant Guide</b>", body))
story.append(
    Paragraph(
        "Our app can show a plant handbook, planting recommendations, care "
        "reminders, a rough harvest estimate, and a photo diary with simple health "
        "tags because our user comes only on weekends and often needs basic advice, "
        "not only sensor numbers.",
        body,
    )
)
story.append(Paragraph("What we plan to build:", body))
for text in [
    "Handbook for common crops (tomato, cucumber, pepper, greens) with short care tips and normal ranges for temperature and moisture.",
    "Recommended plantings by month for a typical dacha greenhouse.",
    "Reminders for watering, planting and harvest time.",
    "Approximate harvest: user enters the crop and how many plants, the app shows a rough yield range from simple reference values.",
    "Photo diary: user adds a photo and marks the plant as OK, yellow leaves, pests, or other. The app does not recognize diseases from the photo by itself.",
]:
    story.append(Paragraph("- " + text, bullet))
story.append(
    Paragraph(
        "Plant Guide is separate from the required modules. Login, dashboard, "
        "control, automation, alerts, history, settings and offline mode stay as "
        "required. Plant Guide is the advice and planning part for the same user.",
        body,
    )
)

story.append(Paragraph("4. Direction", h2))
story.append(
    Paragraph(
        "1. Easy to use for beginners who are not farmers (clear texts, handbook, reminders).",
        bullet,
    )
)
story.append(
    Paragraph(
        "2. Careful with water (automatic irrigation only when soil is dry enough; reminders not to overwater).",
        bullet,
    )
)

story.append(Paragraph("5. Feature list M1-M8", h2))
for text in [
    "<b>M1 Login.</b> Email and password. Wrong password shows an error. Logout works. Each user sees only their own greenhouse.",
    "<b>M2 Dashboard.</b> Air temperature, air humidity, soil moisture, light, and time of last update. Values update when data in the database changes.",
    "<b>M3 Control.</b> Buttons for irrigation, ventilation and lighting. A press changes the device state in the database, and the app shows the new state.",
    "<b>M4 Modes.</b> Manual and automatic. In automatic mode a rule works, for example: soil moisture below the set threshold turns irrigation on.",
    "<b>M5 Alerts.</b> If a value goes outside the allowed range (for example 45 C), the app shows an alert with clear text.",
    "<b>M6 History.</b> Charts for at least two parameters. User can choose day or week.",
    "<b>M7 Settings.</b> User can change thresholds, a simple schedule and units. Automation uses the new values.",
    "<b>M8 No internet.</b> The app shows that there is no connection, does not crash, and works again when the internet returns.",
]:
    story.append(Paragraph(text, body))

story.append(Paragraph("6. Team and roles", h2))
data = [
    [Paragraph("<b>Name</b>", cellb), Paragraph("<b>Role</b>", cellb)],
    [
        Paragraph("Zholgali Dias", cell),
        Paragraph("Team lead, app control and automation", cell),
    ],
    [
        Paragraph("Basiev David", cell),
        Paragraph("Design (Figma, logo, style)", cell),
    ],
    [
        Paragraph("Umbetalieva Adelya", cell),
        Paragraph("Data and Firebase", cell),
    ],
    [
        Paragraph("Marat Gaukhar", cell),
        Paragraph("Plant Guide, history charts, documents", cell),
    ],
]
table = Table(data, colWidths=[55 * mm, 115 * mm])
table.setStyle(
    TableStyle(
        [
            ("GRID", (0, 0), (-1, -1), 0.6, colors.black),
            ("BACKGROUND", (0, 0), (-1, 0), colors.Color(0.92, 0.92, 0.92)),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 5),
            ("RIGHTPADDING", (0, 0), (-1, -1), 5),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ]
    )
)
story.append(table)
story.append(Spacer(1, 6))
story.append(
    Paragraph(
        "All members are added to the GitHub repository. Roles are also listed in the README of the repository.",
        body,
    )
)

doc.build(story)
print(out)
print(out.stat().st_size)
