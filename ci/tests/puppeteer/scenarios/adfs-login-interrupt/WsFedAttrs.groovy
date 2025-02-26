Map run(final Object... args) {
    def attributes = (Map) args[0]
    def logger = (Logger) args[1]
    logger.info("Mutating attributes {}", attributes)
    def result = new LinkedHashMap<>(attributes)
    result["email"] = ["casuser@example.org"]
    result["upn"] = ["casuser@apereo.org"]
    return result
}
