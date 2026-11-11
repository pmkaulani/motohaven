const SUPABASE_URL = "https://dfswwtrwoyqzirmyeqht.supabase.co";
const SUPABASE_KEY = "sb_publishable_9TJ8Ion_pahnxABDgiV7Dg_gzvVUL57";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

/* =========================================================
   MotoHaven - script.js (multi-photo version)
   ========================================================= */

const STORAGE_KEY = "motohavenListings";
const MAX_PHOTOS = 20;          // photos allowed per car
const MAX_PHOTO_MB = 10;        // size limit for each original photo
const SAVED_PHOTO_WIDTH = 640;  // photos are shrunk to this width to fit in browser storage

/* ---------- Car data (filled in from the listings people publish) ---------- */
const carDetails = {};

/* ---------- Small helpers ---------- */
function $(id) {
    return document.getElementById(id);
}

function setText(id, text) {
    const el = $(id);
    if (el) el.textContent = text;
}

/* ---------- Sold / delete state ---------- */
const STATE_KEY = "motohavenState";
let openDetailId = null; // which car is open in the details panel

function loadState() {
    try {
        const saved = JSON.parse(localStorage.getItem(STATE_KEY));
        return {
            sold: (saved && saved.sold) || {},       // cars marked as sold
            removed: (saved && saved.removed) || {}  // sample cars that were deleted
        };
    } catch (e) {
        return { sold: {}, removed: {} };
    }
}

function saveState(state) {
    try {
        localStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error("Could not save car status.", e);
    }
}

/* Show or hide the SOLD badge on a card */
function styleSold(card, sold) {
    const image = card.querySelector(".car-image");
    if (image) image.style.filter = sold ? "grayscale(1)" : "";

    card.style.position = "relative";

    let badge = card.querySelector(".sold-badge");

    if (sold && !badge) {
        badge = document.createElement("span");
        badge.className = "sold-badge";
        badge.textContent = "SOLD";
        Object.assign(badge.style, {
            position: "absolute",
            top: "30px",
            left: "30px",
            background: "#c62828",
            color: "white",
            padding: "6px 14px",
            borderRadius: "4px",
            fontWeight: "bold",
            letterSpacing: "1px",
            zIndex: "2"
        });
        card.appendChild(badge);
    }

    if (!sold && badge) badge.remove();
}

function styleActionButton(button, background, color) {
    Object.assign(button.style, {
        flex: "1",
        width: "auto",
        marginTop: "0",
        padding: "10px",
        background: background,
        color: color,
        border: "none",
        borderRadius: "5px",
        fontWeight: "bold",
        cursor: "pointer"
    });
}

/* Add the "Mark as Sold" and "Delete" buttons to a card */
function decorateCard(card, id) {
    let sold = !!loadState().sold[id];
    styleSold(card, sold);

    const actions = document.createElement("div");
    actions.className = "card-actions";
    Object.assign(actions.style, { display: "flex", gap: "8px", marginTop: "10px" });

    const soldButton = document.createElement("button");
    soldButton.type = "button";
    soldButton.textContent = sold ? "Mark Available" : "Mark as Sold";
    styleActionButton(soldButton, "#d4af37", "#111");

    soldButton.addEventListener("click", function () {
        const state = loadState();
        sold = !state.sold[id];

        if (sold) {
            state.sold[id] = true;
        } else {
            delete state.sold[id];
        }
        saveState(state);

        styleSold(card, sold);
        soldButton.textContent = sold ? "Mark Available" : "Mark as Sold";

        // Keep the details panel in step if this car is open
        if (openDetailId === id && carDetails[id]) {
            setText("detailPrice", carDetails[id].price + (sold ? " (SOLD)" : ""));
            renderContact(carDetails[id], sold);
        }
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    styleActionButton(deleteButton, "#c62828", "white");

    deleteButton.addEventListener("click", function () {
        const name = card.querySelector("h3").textContent;
        if (!confirm("Delete " + name + "? This cannot be undone.")) return;

        const state = loadState();

        if (id.indexOf("user-") === 0) {
            // A car you listed: remove it from saved listings
            saveListings(loadListings().filter(function (listing) {
                return listing.id !== id;
            }));
            delete carDetails[id];
        } else {
            // One of the built-in sample cars: remember that it was removed
            state.removed[id] = true;
        }

        delete state.sold[id];
        saveState(state);

        if (openDetailId === id) closeDetails();
        card.remove();
        updateEmptyState();
    });

    actions.append(soldButton, deleteButton);
    card.appendChild(actions);
}

/* ---------- Message shown when there are no cars yet ---------- */
function updateEmptyState() {
    const container =
        document.querySelector("#cars .car-container") ||
        document.querySelector(".car-container");
    if (!container) return;

    let message = $("emptyMessage");
    const hasCars = container.querySelector(".car-card");

    if (!hasCars && !message) {
        message = document.createElement("p");
        message.id = "emptyMessage";
        message.textContent = "No cars listed yet. Be the first to sell yours below!";
        Object.assign(message.style, {
            width: "100%",
            textAlign: "center",
            color: "#666",
            padding: "30px 0"
        });
        container.appendChild(message);
    }

    if (hasCars && message) message.remove();
}

/* ---------- Search and filters (called from your HTML) ---------- */
function filterCars() {
    const search = ($("searchInput") ? $("searchInput").value : "").toLowerCase();
    const brand = $("brandFilter") ? $("brandFilter").value.toLowerCase() : "";
    const location = $("locationFilter") ? $("locationFilter").value.toLowerCase() : "";
    const condition = $("conditionFilter") ? $("conditionFilter").value.toLowerCase() : "";

    document.querySelectorAll(".car-card").forEach(function (car) {
        const name = car.querySelector("h3").textContent.toLowerCase();

        const matchesSearch = name.includes(search);
        const matchesBrand = !brand || (car.dataset.brand || "").toLowerCase() === brand;
        const matchesLocation = !location || (car.dataset.location || "").toLowerCase() === location;
        const matchesCondition = !condition || (car.dataset.condition || "").toLowerCase() === condition;

        if (matchesSearch && matchesBrand && matchesLocation && matchesCondition) {
            car.classList.remove("hidden");
        } else {
            car.classList.add("hidden");
        }
    });
}

/* ---------- Photo gallery on the details panel ---------- */
function renderGallery(images) {
    const box = $("detailGallery");
    if (!box) return;

    box.innerHTML = "";
    if (!images || images.length === 0) return;

    const main = document.createElement("img");
    main.src = images[0];
    main.alt = "Car photo";
    main.style.width = "100%";
    main.style.maxHeight = "380px";
    main.style.objectFit = "cover";
    main.style.borderRadius = "8px";
    main.style.display = "block";
    box.appendChild(main);

    if (images.length > 1) {
        const strip = document.createElement("div");
        strip.style.display = "flex";
        strip.style.flexWrap = "wrap";
        strip.style.gap = "8px";
        strip.style.marginTop = "10px";

        const thumbs = [];

        images.forEach(function (src, index) {
            const thumb = document.createElement("img");
            thumb.src = src;
            thumb.alt = "Photo " + (index + 1);
            thumb.style.width = "72px";
            thumb.style.height = "54px";
            thumb.style.objectFit = "cover";
            thumb.style.borderRadius = "6px";
            thumb.style.cursor = "pointer";
            thumb.style.border = index === 0 ? "2px solid #d4af37" : "2px solid transparent";

            thumb.addEventListener("click", function () {
                main.src = src;
                thumbs.forEach(function (t) { t.style.border = "2px solid transparent"; });
                thumb.style.border = "2px solid #d4af37";
            });

            thumbs.push(thumb);
            strip.appendChild(thumb);
        });

        box.appendChild(strip);
    }

    const count = document.createElement("p");
    count.textContent = images.length + (images.length === 1 ? " photo" : " photos");
    count.style.marginTop = "8px";
    count.style.color = "#666";
    box.appendChild(count);
}

/* ---------- Contact the seller (Call + WhatsApp) ---------- */

/* Turn 0712345678, +254712345678 or 712345678 into 254712345678 */
function toInternationalNumber(raw) {
    const digits = String(raw || "").replace(/\D/g, "");

    if (digits.indexOf("254") === 0) return digits;
    if (digits.indexOf("0") === 0) return "254" + digits.slice(1);
    if (digits.length === 9) return "254" + digits;
    return digits;
}

function makeContactLink(text, href, background, color) {
    const link = document.createElement("a");
    link.textContent = text;
    link.href = href;
    Object.assign(link.style, {
        display: "inline-block",
        padding: "12px 20px",
        marginRight: "10px",
        marginTop: "8px",
        background: background,
        color: color,
        borderRadius: "6px",
        fontWeight: "bold",
        textDecoration: "none"
    });
    return link;
}

function renderContact(details, sold) {
    let box = $("detailContact");

    // Create the contact area under the mileage line if your HTML doesn't have one
    if (!box) {
        const anchor = $("detailMileage");
        if (!anchor) return;
        box = document.createElement("div");
        box.id = "detailContact";
        anchor.insertAdjacentElement("afterend", box);
    }

    box.innerHTML = "";

    // Sample cars have no seller details
    if (!details || (!details.phone && !details.whatsapp)) return;

    Object.assign(box.style, {
        marginTop: "20px",
        paddingTop: "15px",
        borderTop: "1px solid #ddd"
    });

    const heading = document.createElement("p");
    heading.textContent = details.seller ? "Seller: " + details.seller : "Contact the seller";
    heading.style.fontWeight = "bold";
    box.appendChild(heading);

    if (sold) {
        const soldNote = document.createElement("p");
        soldNote.textContent = "This car has been sold.";
        soldNote.style.color = "#c62828";
        box.appendChild(soldNote);
        return;
    }

    if (details.phone) {
        box.appendChild(makeContactLink(
            "📞 Call seller",
            "tel:+" + toInternationalNumber(details.phone),
            "#111",
            "white"
        ));
    }

    // Use the WhatsApp number if given, otherwise fall back to the phone number
    const whatsappNumber = details.whatsapp || details.phone;
    if (whatsappNumber) {
        const message = "Hi, I'm interested in the " + details.name +
            " (" + details.price + ") listed on MotoHaven.";

        const whatsappLink = makeContactLink(
            "💬 WhatsApp seller",
            "https://wa.me/" + toInternationalNumber(whatsappNumber) +
                "?text=" + encodeURIComponent(message),
            "#25D366",
            "#111"
        );
        whatsappLink.target = "_blank";
        whatsappLink.rel = "noopener";
        box.appendChild(whatsappLink);
    }
}

/* ---------- Car details panel (called from your HTML) ---------- */
function showDetails(key) {
    const details = carDetails[key];
    if (!details) return;

    renderGallery(details.images);

    setText("detailName", details.name);
    setText("detailPrice", details.price + (loadState().sold[key] ? " (SOLD)" : ""));
    openDetailId = key;
    renderContact(details, !!loadState().sold[key]);
    setText("detailYear", "Year: " + details.year);
    setText("detailLocation", "Location: " + details.location);
    setText("detailCondition", "Condition: " + details.condition);
    setText("detailEngine", "Engine: " + (details.engine || "Not provided"));
    setText("detailTransmission", "Transmission: " + (details.transmission || "Not provided"));
    setText("detailFuel", "Fuel: " + (details.fuel || "Not provided"));
    setText("detailMileage", "Mileage: " + (details.mileage || "Not provided"));

    const panel = $("carDetails");
    if (panel) {
        panel.style.display = "block";
        panel.scrollIntoView({ behavior: "smooth" });
    }
}

function closeDetails() {
    openDetailId = null;
    const panel = $("carDetails");
    if (panel) panel.style.display = "none";
}

/* ---------- Saved listings ---------- */
function loadListings() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveListings(listings) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
        return true;
    } catch (e) {
        alert("Could not save the listing: browser storage is full. Try fewer photos, or remove an old listing.");
        return false;
    }
}

/* Shrink a photo so many of them fit in browser storage */
function resizeImage(file, maxWidth) {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = function () {
            const img = new Image();
            img.onerror = reject;
            img.onload = function () {
                const scale = Math.min(1, maxWidth / img.width);
                const canvas = document.createElement("canvas");
                canvas.width = Math.round(img.width * scale);
                canvas.height = Math.round(img.height * scale);
                canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL("image/jpeg", 0.6));
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });

}
async function uploadCarPhotos(files) {
    const photoUrls = [];

    for (const file of files) {
        const fileName = Date.now() + "-" +
            Math.random().toString(36).substring(2) + ".jpg";

        const resizedImage = await resizeImage(file, SAVED_PHOTO_WIDTH);

        const response = await fetch(resizedImage);
        const blob = await response.blob();

        const { data, error } = await supabaseClient.storage
            .from("car-photos")
            .upload(fileName, blob, {
                contentType: "image/jpeg"
            });

        if (error) {
            throw error;
        }

        const { data: publicData } = supabaseClient.storage
            .from("car-photos")
            .getPublicUrl(data.path);

        photoUrls.push(publicData.publicUrl);
    }

    return photoUrls;
}
/* Add an option to a <select> if it isn't already there */
function addFilterOption(selectId, value) {
    const select = $(selectId);
    if (!select || !value) return;

    const exists = Array.from(select.options).some(function (option) {
        return option.value.toLowerCase() === value.toLowerCase();
    });

    if (!exists) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    }
}

/* Build a car card and add it to the Featured Cars list */
function createCard(listing) {
    const container =
        document.querySelector("#cars .car-container") ||
        document.querySelector(".car-container") ||
        document.querySelector("#cars");

    if (!container) {
        console.error("Featured cars list not found. Add class=\"car-container\" to the div that holds your car cards.");
        return;
    }

    const images = listing.images || [];

    const card = document.createElement("div");
    card.className = "car-card";
    card.dataset.id = listing.id;
    card.dataset.brand = listing.brand;
    card.dataset.location = listing.location;
    card.dataset.condition = listing.condition;

    const image = document.createElement("img");
    image.className = "car-image";
    image.src = images[0] || "";
    image.alt = listing.name;

    const name = document.createElement("h3");
    name.textContent = listing.name;

    const yearText = document.createElement("p");
    yearText.textContent = "Year: " + listing.year;

    const locationText = document.createElement("p");
    locationText.textContent = "Location: " + listing.location;

    const conditionText = document.createElement("p");
    conditionText.textContent = "Condition: " + listing.condition;

    const photoText = document.createElement("p");
    photoText.textContent = "📷 " + images.length + (images.length === 1 ? " photo" : " photos");

    const priceText = document.createElement("h4");
    priceText.textContent = listing.price;

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "View Details";
    button.addEventListener("click", function () {
        showDetails(listing.id);
    });

    card.append(image, name, yearText, locationText, conditionText, photoText, priceText, button);

    // Newest listing goes first in Featured Cars
    container.prepend(card);
    decorateCard(card, listing.id);
    updateEmptyState();

    addFilterOption("brandFilter", listing.brand);
    addFilterOption("locationFilter", listing.location);
}

/* Register a listing so View Details works for it */
function registerListing(listing) {
    carDetails[listing.id] = listing;
}

/* ---------- Everything that needs the page to be loaded ---------- */
document.addEventListener("DOMContentLoaded", function () {

   /* Load car listings from Supabase */
async function loadSupabaseListings() {
    const { data, error } = await supabaseClient
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Could not load car listings:", error);
        return;
    }

    data.forEach(function (row) {
        const listing = {
            id: row.id,
            brand: row.brand,
            model: row.model,
            name: row.brand + " " + row.model,
            year: row.year,
            price: "KSh " + Number(row.price).toLocaleString("en-KE"),
            location: row.location,
            condition: row.condition,
            seller: row.seller_name,
            phone: row.phone,
            whatsapp: row.whatsapp,
            engine: row.engine_cc + "cc",
            transmission: row.transmission,
            fuel: row.fuel,
            mileage: row.mileage + " km",
            images: row.photo_urls || []
        };

        registerListing(listing);
        createCard(listing);
    });

    updateEmptyState();
}

loadSupabaseListings();

    /* Any cars written directly in the HTML: work out each one's id from its View Details
       button, hide it if it was deleted, and add the Sold / Delete buttons */
    document.querySelectorAll(".car-card:not([data-id])").forEach(function (card) {
        const detailsButton = card.querySelector("button[onclick*='showDetails']");
        const match = detailsButton && detailsButton.getAttribute("onclick").match(/showDetails\('([^']+)'\)/);
        if (!match) return;

        const id = match[1];

        if (loadState().removed[id]) {
            card.remove();
            return;
        }

        card.dataset.id = id;
        decorateCard(card, id);
    });

    /* ----- Photo picker: keeps adding photos, shows previews with remove buttons ----- */
    const photoInput = $("carImage");
    const imagePreview = $("imagePreview");
    let selectedFiles = [];

    function renderPreview() {
        if (!imagePreview) return;
        imagePreview.innerHTML = "";

        if (selectedFiles.length === 0) return;

        const counter = document.createElement("p");
        counter.textContent = selectedFiles.length + " of " + MAX_PHOTOS + " photos selected";
        counter.style.margin = "8px 0";
        imagePreview.appendChild(counter);

        selectedFiles.forEach(function (file, index) {
            const box = document.createElement("div");
            box.style.position = "relative";
            box.style.display = "inline-block";
            box.style.margin = "4px";

            const img = document.createElement("img");
            img.src = URL.createObjectURL(file);
            img.style.width = "100px";
            img.style.height = "75px";
            img.style.objectFit = "cover";
            img.style.borderRadius = "8px";
            img.style.display = "block";

            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.textContent = "×";
            removeBtn.setAttribute("aria-label", "Remove photo");
            removeBtn.style.position = "absolute";
            removeBtn.style.top = "2px";
            removeBtn.style.right = "2px";
            removeBtn.style.width = "24px";
            removeBtn.style.height = "24px";
            removeBtn.style.padding = "0";
            removeBtn.style.background = "red";
            removeBtn.style.color = "white";
            removeBtn.style.border = "none";
            removeBtn.style.borderRadius = "50%";
            removeBtn.style.cursor = "pointer";

            removeBtn.addEventListener("click", function () {
                selectedFiles.splice(index, 1);
                renderPreview();
            });

            box.append(img, removeBtn);
            imagePreview.appendChild(box);
        });
    }

    if (photoInput) {
        photoInput.addEventListener("change", function () {
            const incoming = Array.from(photoInput.files);

            for (const file of incoming) {
                if (!file.type.startsWith("image/")) continue;

                if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
                    alert(file.name + " is larger than " + MAX_PHOTO_MB + "MB and was skipped.");
                    continue;
                }

                const duplicate = selectedFiles.some(function (f) {
                    return f.name === file.name && f.size === file.size && f.lastModified === file.lastModified;
                });
                if (duplicate) continue;

                if (selectedFiles.length >= MAX_PHOTOS) {
                    alert("You can add up to " + MAX_PHOTOS + " photos per car.");
                    break;
                }

                selectedFiles.push(file);
            }

            // Clear the input so the same photo can be picked again later, and
            // so the next selection ADDS to the list instead of replacing it.
            photoInput.value = "";
            renderPreview();
        });
    }

    /* ----- Publish form ----- */
    const form = $("sellCarForm") || $("carForm") || $("sellForm");

    if (!form) {
        console.error("Sell form not found. Check that your <form> has id=\"sellCarForm\".");
        return;
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const brand = $("carBrand").value.trim();
        const model = $("carModel").value.trim();
        const year = $("carYear").value;
        const price = $("carPrice").value;
        const location = $("carLocation").value.trim();
        const condition = $("carCondition").value;
        const seller = $("sellerName") ? $("sellerName").value.trim() : "";
        const phone = $("sellerPhone") ? $("sellerPhone").value.trim() : "";
        const whatsapp = $("sellerWhatsApp") ? $("sellerWhatsApp").value.trim() : "";
        const pin = $("listingPin").value.trim();
        const engineCc = $("engineSize") ? $("engineSize").value : "";
        const transmission = $("carTransmission") ? $("carTransmission").value : "";
        const fuel = $("carFuel") ? $("carFuel").value : "";
        const mileageKm = $("carMileage") ? $("carMileage").value : "";

        /* Validation */
        if (!brand || !model || !year || !price || !location || !condition) {
            alert("Please fill in all the car details.");
            return;
        }
        if (!/^\d{4,8}$/.test(pin)) {
    alert("Your PIN must contain 4 to 8 digits.");
    return;
}

        const phonePattern = /^(0\d{9}|\+254\d{9})$/;
        if (phone && !phonePattern.test(phone)) {
            alert("Enter a valid phone number, e.g. 0712345678.");
            return;
        }

        if (selectedFiles.length === 0) {
            alert("Please add at least one car photograph.");
            return;
        }

        /* Shrink all photos, then build the listing */
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalLabel = submitBtn ? submitBtn.textContent : "";
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Publishing...";
        }

        try {
            let images;
            try {
                images = await Promise.all(
                    selectedFiles.map(function (file) {
                        return resizeImage(file, SAVED_PHOTO_WIDTH);
                    })
                );
            } catch (e) {
                alert("One of the photos could not be read. Remove it and try again.");
                return;
            }

           
             
            /* Upload photos to Supabase Storage */
const photoUrls = await uploadCarPhotos(selectedFiles);

/* Publish listing to Supabase */
const { data, error } = await supabaseClient.rpc("create_listing", {
    p_brand: brand,
    p_model: model,
    p_year: Number(year),
    p_price: Number(price),
    p_location: location,
    p_condition: condition,
    p_engine_cc: Number(engineCc),
    p_transmission: transmission,
    p_fuel: fuel,
    p_mileage: Number(mileageKm),
    p_seller_name: seller,
    p_phone: phone,
    p_whatsapp: whatsapp,
    p_photo_urls: photoUrls,
    p_pin: pin
});

if (error) {
    console.error("Publishing failed:", error);
    alert("Could not publish your car. Please try again.");
    return;
}

const newListing = {
    id: data,
    brand: brand,
    model: model,
    name: brand + " " + model,
    year: year,
    price: "KSh " + Number(price).toLocaleString("en-KE"),
    location: location,
    condition: condition,
    seller: seller,
    phone: phone,
    whatsapp: whatsapp,
    engine: Number(engineCc).toLocaleString("en-KE") + "cc",
    transmission: transmission,
    fuel: fuel,
    mileage: Number(mileageKm).toLocaleString("en-KE") + " km",
    images: photoUrls
};

registerListing(newListing);
createCard(newListing);
            setText("formMessage", "Your car listing has been added successfully!");

            form.reset();
            selectedFiles = [];
            renderPreview();

            const carsSection = $("cars");
            if (carsSection) carsSection.scrollIntoView({ behavior: "smooth" });
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalLabel;
            }
        }
    });
});
async function testSupabaseConnection() {
    const { data, error } = await supabaseClient
        .from("listings")
        .select("*")
        .limit(1);

    if (error) {
        console.error("Database connection failed:", error);
    } else {
        console.log("MotoHaven database connected successfully!", data);
    }
}

testSupabaseConnection();