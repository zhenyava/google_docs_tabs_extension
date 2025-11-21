# Google Docs Tab Exporter

A Google Apps Script add-on that fixes the export workflow for the new Google Docs "Tabs" feature. It allows you to download specific tabs with correct filenames and multiple format options.

## 🧐 The Problem

Google Docs recently introduced **Tabs** to organize content within a single document. However, the native export functionality (`File > Download`) has significant limitations:

1.  **Naming Issues:** When downloading a specific tab, Google Docs often uses the *Document Name* instead of the *Tab Name*. Users have to manually rename every file after downloading.
2.  **Workflow Friction:** Exporting the currently active tab requires navigating through menus and manually selecting the tab from a list, rather than just clicking "Download Current Tab".
3.  **Visibility:** It is not always clear how to export just one section of a large document.

## 💡 The Solution

**Tab Exporter** is a script that integrates directly into the Google Docs interface. It utilizes the Google Docs API to read the document structure (including nested/child tabs) and offers a seamless export experience.

**Key Features:**
*   **Smart Naming:** Automatically names the downloaded file based on the *Tab Name* (e.g., `Chapter 1.pdf` instead of `My Huge Document.pdf`).
*   **Context Awareness:** Automatically detects which tab you are currently viewing and selects it by default.
*   **Two Modes:**
    *   **Quick Export:** One-click download of the selected tab in your preferred format.
    *   **Advanced Export:** A modal window to choose any tab (even nested ones), change the format, and customize the filename before downloading.
*   **Multi-Format Support:** PDF, DOCX, TXT, HTML, EPUB.
*   **Multi-Language:** The interface automatically translates (English, Russian, etc.) based on the user's Google locale.

## 🛠 Installation

Since this is a standalone script (not yet published to the Marketplace), you can install it directly into any Google Doc.

### Step-by-Step

1.  Open your Google Document.
2.  In the top menu, go to **Extensions** > **Apps Script**.
3.  **Copy the Code:**
    *   Open the file `Code.gs` (default) and paste the contents of the server-side script.
    *   Click the `+` icon next to "Files", select **HTML**, name it `Sidebar`, and paste the contents of the HTML file.
4.  **Enable Google Docs API (Important!):**
    *   In the Apps Script editor, look at the left sidebar.
    *   Click on **Services** (`+` icon).
    *   Find **Google Docs API** in the list.
    *   Click **Add**.
5.  **Save:** Click the floppy disk icon or press `Ctrl+S` / `Cmd+S`.
6.  **Reload:** Go back to your Google Doc tab and refresh the page (F5).

## 🚀 Usage

1.  After reloading, you will see a new menu item: **Export Tab** (or *Экспорт вкладки* depending on your language).
2.  **Quick Export:**
    *   Go to **Export Tab** > **Export Selected Tab**.
    *   Choose a format (e.g., PDF).
    *   The script will prepare the file and download it immediately with the correct name.
3.  **Manual Export:**
    *   Go to **Export Tab** > **Export Any Tab**.
    *   Choose a format.
    *   A window will open allowing you to select a specific tab from the list and manually edit the filename.

## 🔐 Permissions

On the first run, Google will ask for permission to:
*   **View and manage your Google Docs documents:** To read the tab structure.
*   **See, edit, create, and delete all of your Google Drive files:** Required by the script to generate the temporary download blob.
*   **Connect to an external service:** To fetch the export link.

*Note: This script runs entirely within your Google account. No data is sent to third-party servers.*

