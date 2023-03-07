/**
 * Recursively build nested structure of attributes based on provided entity.
 * The maxDepth value is hardcoded to prevent infinite recursion.
 *
 * @param {string} entity
 * @param {AttributeStructureBuildingInfo} [info]
 * @return {Array}
 */
function buildObjectByEntity(entity, info = {}) {
  const {ancestorEntity, depthCounter, ancestorCustomAttr, designerKind} = info
  let counter = depthCounter || 0
  const serviceEntity = ancestorEntity || entity
  const MAX_DEPTH = 6

  return Object.values(connection.domain.get(entity).attributes)
    .filter(attr => filterAttributesToDisplay(attr, designerKind))
    .map(attr => {
      const {code, caption, dataType, associatedEntity} = attr
      return {
        entity: serviceEntity,
        code,
        caption: getEntityAttributeCaption(attr),
        name: caption,
        dataType,
        associatedEntity,
        ancestorCustomAttr,
        iconCls: getIconForUBDataType(dataType),
        children: dataType === ubDataTypes.Entity && associatedEntity && counter < MAX_DEPTH
          ? buildObjectByEntity(
            associatedEntity,
            {
              ancestorEntity: serviceEntity,
              depthCounter: ++counter,
              ancestorCustomAttr
            }
          )
          : undefined
      }
    })
}
