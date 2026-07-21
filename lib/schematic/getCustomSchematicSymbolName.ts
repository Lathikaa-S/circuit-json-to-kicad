import type {
  CadComponent,
  CircuitJson,
  SourceComponentBase,
} from "circuit-json"
import { getKicadCompatibleComponentName } from "../utils/getKicadCompatibleComponentName"

export const getCustomSchematicSymbolName = ({
  explicitName,
  sourceComponent,
  cadComponent,
  schematicSymbolId,
  circuitJson,
}: {
  explicitName?: string
  sourceComponent: SourceComponentBase
  cadComponent?: CadComponent | null
  schematicSymbolId: string
  circuitJson: CircuitJson
}) =>
  explicitName ||
  (circuitJson.filter((element) => element.type === "schematic_symbol").length >
  1
    ? `${getKicadCompatibleComponentName(sourceComponent, cadComponent)}_${schematicSymbolId}`
    : getKicadCompatibleComponentName(sourceComponent, cadComponent))
