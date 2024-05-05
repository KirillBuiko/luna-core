import type {NarrowedDestination, NarrowedSource, ProtocolType} from "@/types/Types";

export interface IPipeBuilder<S extends ProtocolType = ProtocolType, D extends ProtocolType = ProtocolType> {
    buildPipe(sourceOptions: NarrowedSource<S>,
              destOptions: NarrowedDestination<D>): void;
}
