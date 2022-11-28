function escapeMetaCharacters(string) {
    return string.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&')
}