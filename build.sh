#!/bin/bash

SRC_DIR=./src
BUILD_DIR=./build
BUILD_DIR_ABSOLUTE=$(realpath $BUILD_DIR)
CURRENT_VERSION=$(jq -r '.version' "$SRC_DIR/manifest.json")
VERSION=${1:-$CURRENT_VERSION}

if ! mkdir -p "$BUILD_DIR"; then
    echo "Failed to create build directory: $BUILD_DIR"
    exit 1
fi

echo "Build directory confirmed: $BUILD_DIR"

if [ "$#" -eq 1 ]; then
    if ! jq --indent 4 "(.version |= \"$VERSION\")" "$SRC_DIR/manifest.json" >"$SRC_DIR/manifest.json.tmp"; then
        echo "Failed to update version in manifest.json"
        exit 1
    fi
    mv "$SRC_DIR/manifest.json.tmp" "$SRC_DIR/manifest.json"
    echo "Updated src/manifest.json version to: $VERSION"
fi

TMP_ZIP_DIR=$(mktemp -d)
TMP_XPI_DIR=$(mktemp -d)
echo "Created temp directories"
trap 'rm -rf "$TMP_ZIP_DIR" "$TMP_XPI_DIR"' EXIT

cp -r "$SRC_DIR/"* "$TMP_ZIP_DIR"
cp -r "$SRC_DIR/"* "$TMP_XPI_DIR"
echo "Copied $SRC_DIR to [$TMP_ZIP_DIR, $TMP_XPI_DIR]"

cp -r "./LICENSE"* "$TMP_ZIP_DIR"
cp -r "./LICENSE"* "$TMP_XPI_DIR"
echo "Copied LICENSE to [$TMP_ZIP_DIR, $TMP_XPI_DIR]"

if ! jq --indent 4 '. + {browser_specific_settings: {gecko: {id: "plunger@fraser"}}}' "$TMP_XPI_DIR/manifest.json" >"$TMP_XPI_DIR/manifest.json.tmp"; then
    echo "Failed to add browser-specific settings to Firefox manifest"
    exit 1
fi
echo "Added browser-specific settings to Firefox manifest"

mv "$TMP_XPI_DIR/manifest.json.tmp" "$TMP_XPI_DIR/manifest.json"

(cd "$TMP_ZIP_DIR" && zip -T -u -r "$BUILD_DIR_ABSOLUTE/plunger@$VERSION.zip" *)
(cd "$TMP_XPI_DIR" && zip -T -u -r "$BUILD_DIR_ABSOLUTE/plunger@$VERSION.xpi" *)

echo "Build $VERSION complete:  [$BUILD_DIR/plunger@$VERSION.xpi, $BUILD_DIR/plunger@$VERSION.zip]"
